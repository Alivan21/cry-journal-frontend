/* eslint-disable react-refresh/only-export-components */
import {
  format,
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { ChevronDownIcon, Clock3Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/libs/clsx";

const REFERENCE_DATE = new Date(1970, 0, 1, 0, 0, 0, 0);
const ITEM_HEIGHT = 36;
const COLUMN_HEIGHT = ITEM_HEIGHT * 7;
const COLUMN_PADDING = (COLUMN_HEIGHT - ITEM_HEIGHT) / 2;

type TimeValue = Date | undefined;

export type TimeFormat = "12h" | "24h";

type ControllableStateProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

type WheelOption = {
  value: number | string;
  label: string;
};

export type TimePickerPanelProps = {
  value?: TimeValue;
  onChange?: (value: TimeValue) => void;
  timeFormat?: TimeFormat;
  withSeconds?: boolean;
  className?: string;
  open?: boolean;
};

export type TimePickerProps = {
  value?: TimeValue;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue) => void;
  timeFormat?: TimeFormat;
  withSeconds?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
  popoverContentClassName?: string;
  popoverContentProps?: React.ComponentProps<typeof PopoverContent>;
  nested?: boolean;
};

function useControllableState<T>({ value, defaultValue, onChange }: ControllableStateProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  return [currentValue, setValue] as const;
}

function padNumber(value: number) {
  return value.toString().padStart(2, "0");
}

function createBaseDate(value: TimeValue) {
  return setMilliseconds(new Date(value ?? REFERENCE_DATE), 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTimeValue(value: TimeValue, timeFormat: TimeFormat, withSeconds: boolean) {
  if (!value) {
    return "";
  }

  if (timeFormat === "12h") {
    return format(value, withSeconds ? "hh:mm:ss aa" : "hh:mm aa");
  }

  return format(value, withSeconds ? "HH:mm:ss" : "HH:mm");
}

function getTimeParts(value: TimeValue) {
  const date = createBaseDate(value);
  const hours = getHours(date);

  return {
    hours,
    minutes: getMinutes(date),
    seconds: getSeconds(date),
    period: hours >= 12 ? "PM" : "AM",
    displayHour12: hours % 12 || 12,
  };
}

function set24HourPart(value: TimeValue, hours: number) {
  return setHours(createBaseDate(value), hours);
}

function set12HourPart(value: TimeValue, hour12: number) {
  const date = createBaseDate(value);
  const currentHours = getHours(date);
  const isPm = currentHours >= 12;
  const normalizedHour = hour12 % 12;

  return setHours(date, isPm ? normalizedHour + 12 : normalizedHour);
}

function setPeriodPart(value: TimeValue, period: "AM" | "PM") {
  const date = createBaseDate(value);
  const hours = getHours(date);
  const normalizedHour = hours % 12;

  return setHours(date, period === "PM" ? normalizedHour + 12 : normalizedHour);
}

function setMinutePart(value: TimeValue, minutes: number) {
  return setMinutes(createBaseDate(value), minutes);
}

function setSecondPart(value: TimeValue, seconds: number) {
  return setSeconds(createBaseDate(value), seconds);
}

function buildNumberOptions(length: number, start = 0) {
  return Array.from({ length }, (_, index) => {
    const value = index + start;

    return {
      value,
      label: padNumber(value),
    };
  });
}

type TimeWheelColumnProps = {
  label: string;
  ariaLabel: string;
  options: WheelOption[];
  selectedValue: number | string;
  onValueChange: (value: number | string) => void;
  open?: boolean;
  className?: string;
};

function TimeWheelColumn({
  label,
  ariaLabel,
  options,
  selectedValue,
  onValueChange,
  open,
  className,
}: TimeWheelColumnProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = React.useRef<number | null>(null);
  const isUserScrollingRef = React.useRef(false);
  const isKeyboardInteractionRef = React.useRef(false);
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const prevOpenRef = React.useRef(open);

  const selectedIndex = React.useMemo(() => {
    const index = options.findIndex((option) => option.value === selectedValue);

    return index >= 0 ? index : 0;
  }, [options, selectedValue]);

  const syncScrollPositionFromEffect = React.useEffectEvent((behavior: ScrollBehavior) => {
    if (isUserScrollingRef.current) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      top: selectedIndex * ITEM_HEIGHT,
      behavior,
    });
  });

  React.useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    prevOpenRef.current = open;

    const behavior: ScrollBehavior = justOpened ? "smooth" : "auto";

    const frame = window.requestAnimationFrame(() => {
      syncScrollPositionFromEffect(behavior);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, selectedIndex]);

  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Only sync focus to the selected button when the column first opens or
  // after a pointer-driven selection — not on every keyboard-repeat tick.
  React.useLayoutEffect(() => {
    if (!open || isKeyboardInteractionRef.current) {
      return;
    }

    const node = optionRefs.current[selectedIndex];
    if (!node) {
      return;
    }

    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== node && viewportRef.current?.contains(active)) {
      node.focus({ preventScroll: true });
    }
  }, [open, selectedIndex]);

  const handleScroll = React.useCallback(() => {
    if (isKeyboardInteractionRef.current) {
      return;
    }

    isUserScrollingRef.current = true;

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        isUserScrollingRef.current = false;
        return;
      }

      const nextIndex = clamp(Math.round(viewport.scrollTop / ITEM_HEIGHT), 0, options.length - 1);
      const nextValue = options[nextIndex]?.value;

      if (nextValue !== undefined && nextValue !== selectedValue) {
        onValueChange(nextValue);
      } else {
        viewport.scrollTo({
          top: selectedIndex * ITEM_HEIGHT,
          behavior: "auto",
        });
      }

      isUserScrollingRef.current = false;
    }, 90);
  }, [onValueChange, options, selectedIndex, selectedValue]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
        return;
      }

      event.preventDefault();

      const delta = event.key === "ArrowUp" ? -1 : 1;
      const nextIndex = clamp(selectedIndex + delta, 0, options.length - 1);
      const nextValue = options[nextIndex]?.value;

      if (nextValue === undefined || nextValue === selectedValue) {
        return;
      }

      isKeyboardInteractionRef.current = true;
      onValueChange(nextValue);

      // Scroll instantly to the new position (no smooth animation during repeat)
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTo({ top: nextIndex * ITEM_HEIGHT, behavior: "auto" });
      }

      // Re-focus the newly selected button so the next key press lands here
      window.requestAnimationFrame(() => {
        optionRefs.current[nextIndex]?.focus({ preventScroll: true });
        isKeyboardInteractionRef.current = false;
      });
    },
    [onValueChange, options, selectedIndex, selectedValue]
  );

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5", className)}>
      <span className="text-foreground/70 px-1 text-center text-xs font-semibold tracking-widest uppercase">
        {label}
      </span>
      <div className="relative">
        <div className="bg-accent pointer-events-none absolute inset-x-1 top-1/2 z-10 h-9 -translate-y-1/2 rounded-lg" />
        <div
          aria-label={ariaLabel}
          className="relative snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          ref={viewportRef}
          role="listbox"
          style={{ height: COLUMN_HEIGHT }}
          tabIndex={-1}
        >
          <div style={{ paddingBlock: COLUMN_PADDING }}>
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  aria-selected={isSelected}
                  className={cn(
                    "relative z-20 flex h-9 w-full snap-center items-center justify-center rounded-lg px-2 text-sm font-medium tabular-nums transition-colors outline-none focus:outline-none focus-visible:outline-none",
                    isSelected
                      ? "text-accent-foreground font-semibold"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                  key={String(option.value)}
                  onClick={() => onValueChange(option.value)}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  role="option"
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimePickerPanel({
  value,
  onChange,
  timeFormat = "12h",
  withSeconds = true,
  className,
  open,
}: TimePickerPanelProps) {
  const parts = getTimeParts(value);

  const hourOptions = React.useMemo(
    () => (timeFormat === "12h" ? buildNumberOptions(12, 1) : buildNumberOptions(24)),
    [timeFormat]
  );
  const minuteOptions = React.useMemo(() => buildNumberOptions(60), []);
  const secondOptions = React.useMemo(() => buildNumberOptions(60), []);
  const periodOptions = React.useMemo<WheelOption[]>(
    () => [
      { value: "AM", label: "AM" },
      { value: "PM", label: "PM" },
    ],
    []
  );

  // useEffectEvent gives stable function identity while always reading the
  // latest value/onChange — no re-creation on every new Date prop, so
  // TimeWheelColumn's handleScroll dependency stays stable during key repeat.
  const handleHourChange = React.useEffectEvent((nextValue: number | string) => {
    if (timeFormat === "12h") {
      onChange?.(set12HourPart(value, Number(nextValue)));
      return;
    }

    onChange?.(set24HourPart(value, Number(nextValue)));
  });

  const handleMinuteChange = React.useEffectEvent((nextValue: number | string) => {
    onChange?.(setMinutePart(value, Number(nextValue)));
  });

  const handleSecondChange = React.useEffectEvent((nextValue: number | string) => {
    onChange?.(setSecondPart(value, Number(nextValue)));
  });

  const handlePeriodChange = React.useEffectEvent((nextValue: number | string) => {
    onChange?.(setPeriodPart(value, nextValue as "AM" | "PM"));
  });

  return (
    <div
      className={cn(
        "bg-popover rounded-xl border p-3 shadow-md",
        "flex items-start gap-0",
        className
      )}
    >
      <TimeWheelColumn
        ariaLabel="Hours"
        label="Hour"
        onValueChange={handleHourChange}
        open={open}
        options={hourOptions}
        selectedValue={timeFormat === "12h" ? parts.displayHour12 : parts.hours}
      />
      <div className="bg-border/50 mt-6 w-px self-stretch" />
      <TimeWheelColumn
        ariaLabel="Minutes"
        label="Minute"
        onValueChange={handleMinuteChange}
        open={open}
        options={minuteOptions}
        selectedValue={parts.minutes}
      />
      {withSeconds ? (
        <>
          <div className="bg-border/50 mt-6 w-px self-stretch" />
          <TimeWheelColumn
            ariaLabel="Seconds"
            label="Second"
            onValueChange={handleSecondChange}
            open={open}
            options={secondOptions}
            selectedValue={parts.seconds}
          />
        </>
      ) : null}
      {timeFormat === "12h" ? (
        <>
          <div className="bg-border/50 mt-6 w-px self-stretch" />
          <TimeWheelColumn
            ariaLabel="AM or PM"
            label="Period"
            onValueChange={handlePeriodChange}
            open={open}
            options={periodOptions}
            selectedValue={parts.period}
          />
        </>
      ) : null}
    </div>
  );
}

function TimePicker({
  value,
  defaultValue,
  onChange,
  timeFormat = "12h",
  withSeconds = true,
  disabled = false,
  className,
  id,
  placeholder = "Select time",
  popoverContentClassName,
  popoverContentProps,
  nested = false,
}: TimePickerProps) {
  const [currentValue, setCurrentValue] = useControllableState<TimeValue>({
    value,
    defaultValue,
    onChange,
  });
  const [open, setOpen] = React.useState(false);
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const displayValue = formatTimeValue(currentValue, timeFormat, withSeconds);
  const { className: contentClassName, ...contentProps } = popoverContentProps ?? {};

  return (
    <Popover modal={nested ? false : undefined} onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label={displayValue || placeholder}
          className={cn(
            "w-full justify-between gap-2 text-left font-normal",
            !currentValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          id={triggerId}
          type="button"
          variant="outline"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Clock3Icon className="text-muted-foreground size-4" />
            <span className="truncate">{displayValue || placeholder}</span>
          </span>
          <ChevronDownIcon className="text-muted-foreground size-4" data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-auto border-none bg-transparent p-0 shadow-none ring-0",
          nested && "z-60",
          popoverContentClassName,
          contentClassName
        )}
        sideOffset={8}
        {...contentProps}
      >
        <TimePickerPanel
          onChange={setCurrentValue}
          open={open}
          timeFormat={timeFormat}
          value={currentValue}
          withSeconds={withSeconds}
        />
      </PopoverContent>
    </Popover>
  );
}

export { TimePicker, TimePickerPanel, formatTimeValue };

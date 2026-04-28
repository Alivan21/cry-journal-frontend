import {
  format,
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon, Clock3Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePickerPanel, formatTimeValue, type TimeFormat } from "@/components/ui/time-picker";
import { cn } from "@/libs/clsx";

type ControllableStateProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export type DateTimePickerKind = "date" | "datetime";

export type DateTimePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (value: Date | undefined) => void;
  type?: DateTimePickerKind;
  mode?: DateTimePickerKind;
  timeFormat?: TimeFormat;
  withSeconds?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
  popoverContentClassName?: string;
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect" | "defaultMonth"
  >;
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

function mergeDateWithTime(dateValue: Date, timeValue?: Date, withSeconds = true) {
  let nextValue = new Date(dateValue);
  nextValue = setHours(nextValue, timeValue ? getHours(timeValue) : 0);
  nextValue = setMinutes(nextValue, timeValue ? getMinutes(timeValue) : 0);
  nextValue = setSeconds(nextValue, withSeconds && timeValue ? getSeconds(timeValue) : 0);

  return nextValue;
}

function mergeTimeWithDate(timeValue: Date, dateValue?: Date, withSeconds = true) {
  let nextValue = new Date(dateValue ?? new Date());
  nextValue = setHours(nextValue, getHours(timeValue));
  nextValue = setMinutes(nextValue, getMinutes(timeValue));
  nextValue = setSeconds(nextValue, withSeconds ? getSeconds(timeValue) : 0);

  return nextValue;
}

function isEventWithinNode(target: EventTarget | null, node: HTMLElement | null) {
  return target instanceof Node && node?.contains(target);
}

function DateTimePicker({
  value,
  defaultValue,
  onChange,
  type,
  mode,
  timeFormat = "12h",
  withSeconds = true,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect,
  disabled = false,
  className,
  id,
  placeholder,
  popoverContentClassName,
  calendarProps,
}: DateTimePickerProps) {
  const pickerType = type ?? mode ?? "datetime";
  const [selectedValue, setSelectedValue] = useControllableState<Date | undefined>({
    value,
    defaultValue,
    onChange,
  });
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [isTimeOpen, setIsTimeOpen] = React.useState(false);
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const outerPanelRef = React.useRef<HTMLDivElement>(null);
  const shouldCloseOnSelect = closeOnSelect ?? pickerType === "date";
  const resolvedPlaceholder =
    placeholder ?? (pickerType === "datetime" ? "Select date and time" : "Select date");
  const displayValue = React.useMemo(() => {
    if (!selectedValue) {
      return resolvedPlaceholder;
    }

    const dateLabel = format(selectedValue, "MMM d, yyyy");

    if (pickerType === "date") {
      return dateLabel;
    }

    return `${dateLabel} ${formatTimeValue(selectedValue, timeFormat, withSeconds)}`;
  }, [pickerType, resolvedPlaceholder, selectedValue, timeFormat, withSeconds]);
  const { captionLayout = "dropdown", ...restCalendarProps } = calendarProps ?? {};

  const selectedDayKey = selectedValue
    ? `${selectedValue.getFullYear()}-${selectedValue.getMonth()}-${selectedValue.getDate()}`
    : undefined;
  const calendarSelectedDay = React.useMemo(
    () => (selectedDayKey ? startOfDay(new Date(selectedDayKey)) : undefined),
    [selectedDayKey]
  );

  const handleOuterOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) setIsTimeOpen(false);
      setIsOpen(nextOpen);
    },
    [setIsOpen]
  );

  const handleDateSelect = React.useCallback(
    (nextDate: Date | undefined) => {
      if (!nextDate) {
        setSelectedValue(undefined);
        return;
      }

      const nextValue =
        pickerType === "datetime"
          ? mergeDateWithTime(nextDate, selectedValue, withSeconds)
          : nextDate;

      setSelectedValue(nextValue);

      if (shouldCloseOnSelect) {
        setIsOpen(false);
      }
    },
    [pickerType, selectedValue, setIsOpen, setSelectedValue, shouldCloseOnSelect, withSeconds]
  );

  const handleTimeChange = React.useCallback(
    (nextTime: Date | undefined) => {
      if (!nextTime) {
        return;
      }

      setSelectedValue(mergeTimeWithDate(nextTime, selectedValue, withSeconds));
    },
    [selectedValue, setSelectedValue, withSeconds]
  );

  const guardNestedPopoverDismiss = React.useCallback(
    (event: { preventDefault: () => void; target: EventTarget | null }) => {
      if (isEventWithinNode(event.target, outerPanelRef.current)) {
        event.preventDefault();
      }
    },
    []
  );

  return (
    <Popover onOpenChange={handleOuterOpenChange} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={displayValue}
          className={cn(
            "h-9 w-full justify-between gap-2 text-left font-normal",
            !selectedValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          id={triggerId}
          type="button"
          variant="outline"
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarIcon className="text-muted-foreground size-4" />
            <span className="truncate">{displayValue}</span>
          </span>
          <ChevronDownIcon className="text-muted-foreground size-4" data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-auto overflow-hidden p-0",
          pickerType === "datetime" && "max-w-[calc(100vw-2rem)] min-w-72",
          popoverContentClassName
        )}
        sideOffset={8}
      >
        <div className="bg-popover" ref={outerPanelRef}>
          <Calendar
            captionLayout={captionLayout}
            defaultMonth={selectedValue}
            mode="single"
            onSelect={handleDateSelect}
            selected={calendarSelectedDay}
            {...restCalendarProps}
            className={cn(pickerType === "datetime" && "w-full", restCalendarProps.className)}
          />
          {pickerType === "datetime" ? (
            <div className="border-t p-3">
              <Popover modal={false} onOpenChange={setIsTimeOpen} open={isTimeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="w-full justify-between gap-2 font-normal"
                    type="button"
                    variant="outline"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Clock3Icon className="text-muted-foreground size-4" />
                      <span className={cn("truncate", !selectedValue && "text-muted-foreground")}>
                        {selectedValue
                          ? formatTimeValue(selectedValue, timeFormat, withSeconds)
                          : "Select time"}
                      </span>
                    </span>
                    <ChevronDownIcon
                      className={cn(
                        "text-muted-foreground size-4 transition-transform",
                        isTimeOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="z-60 w-full border-none bg-transparent p-0 shadow-none ring-0"
                  onFocusOutside={guardNestedPopoverDismiss}
                  onInteractOutside={guardNestedPopoverDismiss}
                  onOpenAutoFocus={(event) => event.preventDefault()}
                  sideOffset={8}
                >
                  <TimePickerPanel
                    onChange={handleTimeChange}
                    open={isTimeOpen}
                    timeFormat={timeFormat}
                    value={selectedValue}
                    withSeconds={withSeconds}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };

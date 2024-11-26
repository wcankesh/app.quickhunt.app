import {Fragment, useEffect, useState} from 'react'
import {Button} from './button'
import {Popover, PopoverContent, PopoverTrigger} from './popover'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './select'
import {Calendar} from './calendar'
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from "lucide-react";
import moment from "moment";

export const formatButtonDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const formatDate = (date, locale = 'en-us') => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).replace(',', '');
}
const getDateAdjustedForTimezone = (dateInput) => {
    if (typeof dateInput === 'string') {
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        return new Date(parts[0], parts[1] - 1, parts[2])
    } else {
        return dateInput
    }
}
export const PRESETS = [
    {name: 'today', label: 'Today', displayDays: 'Today'},
    {name: 'yesterday', label: 'Yesterday', displayDays: 'Yesterday'},
    {name: 'last7', label: 'Last 7 days', displayDays: 'Last 7 days'},
    {name: 'last30', label: 'Last 30 days', displayDays: 'Last 30 days'},
    {name: 'lastMonth', label: 'Last Month', displayDays: 'Last Month'},
    {name: 'last6Month', label: 'Last 6 Month', displayDays: 'Last 6 Month'},
    {name: 'lastYear', label: 'Last Year', displayDays: 'Last Year'},
]

export const getPresetRange = (presetName) => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
    const from = new Date();
    const to = new Date();
    switch (preset.name) {
        case 'today':
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            break;
        case 'yesterday':
            from.setDate(from.getDate() - 1);
            from.setHours(0, 0, 0, 0);
            to.setDate(to.getDate() - 1);
            to.setHours(23, 59, 59, 999);
            break;
        case 'last7':
            from.setDate(from.getDate() - 6);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            break;
        case 'last30':
            from.setDate(from.getDate() - 29);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            break;
        // case 'last90':
        //     from.setDate(from.getDate() - 89);
        //     from.setHours(0, 0, 0, 0);
        //     to.setHours(23, 59, 59, 999);
        //     break;
        // case 'last365':
        //     from.setDate(from.getDate() - 364);
        //     from.setHours(0, 0, 0, 0);
        //     to.setHours(23, 59, 59, 999);
        //     break;
        case 'lastMonth':
            from.setMonth(from.getMonth() - 1);
            from.setDate(1); // First day of last month
            from.setHours(0, 0, 0, 0);
            to.setDate(0); // Last day of last month
            to.setHours(23, 59, 59, 999);
            break;
        case 'last6Month':
            from.setMonth(from.getMonth() - 6);
            from.setDate(1);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            break;
        case 'lastYear':
            from.setFullYear(from.getFullYear() - 1);
            from.setMonth(0); // January
            from.setDate(1);
            from.setHours(0, 0, 0, 0);
            to.setFullYear(to.getFullYear() - 1); // Set `to` to last year
            to.setMonth(11); // December
            to.setDate(31); // Last day of December
            to.setHours(23, 59, 59, 999);
            break;
        // case 'customRange':
        //     if (!customFrom || !customTo) {
        //         throw new Error("Custom range requires both 'from' and 'to' dates.");
        //     }
        //     from.setTime(customFrom.getTime());
        //     to.setTime(customTo.getTime());
        //     break;
    }
    return { from, to };
};

export const DateRangePicker = ({
                                    initialDateFrom ,
                                    initialDateTo,
                                    initialCompareFrom,
                                    initialCompareTo,
                                    onUpdate,
                                    align = 'end',
                                    locale = 'en-US',
                                    showCompare = true
                                }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [label, setLabel] = useState('')
    const [tempLabel, setTempLabel] = useState('Last 30 days')
    const [isApply, setIsApply] = useState(false)
    const [range, setRange] = useState({
        from: initialDateFrom,
        to: initialDateTo
    })
    const [tempRange, setTempRange] = useState({
        from: initialDateFrom,
        to: initialDateTo
    })
    // const customFrom = new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0));
    // const customTo = new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0));
    const [rangeCompare, setRangeCompare] = useState(
        initialCompareFrom
            ? {
                from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
                to: initialCompareTo
                    ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                    : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
            }
            : undefined
    )
    const [selectedPreset, setSelectedPreset] = useState(undefined)
    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 960 : false
    )
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 960)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])


    const setPreset = (preset, label = '') => {
        const range = getPresetRange(preset)
        setRange(range)
        setLabel(label);
        if (rangeCompare) {
            const rangeCompare = {
                from: new Date(
                    range.from.getFullYear() - 1,
                    range.from.getMonth(),
                    range.from.getDate()
                ),
                to: range.to
                    ? new Date(
                        range.to.getFullYear() - 1,
                        range.to.getMonth(),
                        range.to.getDate()
                    )
                    : undefined
            }
            setRangeCompare(rangeCompare)
        }
    }
    const checkPreset = () => {
        for (const preset of PRESETS) {
            const presetRange = getPresetRange(preset.name)
            const normalizedRangeFrom = new Date(range.from);
            normalizedRangeFrom.setHours(0, 0, 0, 0);
            const normalizedPresetFrom = new Date(
                presetRange.from.setHours(0, 0, 0, 0)
            )
            const normalizedRangeTo = new Date(range.to ?? 0);
            normalizedRangeTo.setHours(0, 0, 0, 0);
            const normalizedPresetTo = new Date(
                presetRange.to?.setHours(0, 0, 0, 0) ?? 0
            )
            if (
                normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
            ) {
                setSelectedPreset(preset.name)
                setLabel(preset.label)
                return
            }
        }
        setSelectedPreset(undefined)
        setLabel('')
    }
    const resetValues = () => {
        setRange({
            from:
                typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom,
            to: initialDateTo
                ? typeof initialDateTo === 'string'
                    ? getDateAdjustedForTimezone(initialDateTo)
                    : initialDateTo
                : typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom
        })
        setRangeCompare(
            initialCompareFrom
                ? {
                    from:
                        typeof initialCompareFrom === 'string'
                            ? getDateAdjustedForTimezone(initialCompareFrom)
                            : initialCompareFrom,
                    to: initialCompareTo
                        ? typeof initialCompareTo === 'string'
                            ? getDateAdjustedForTimezone(initialCompareTo)
                            : initialCompareTo
                        : typeof initialCompareFrom === 'string'
                            ? getDateAdjustedForTimezone(initialCompareFrom)
                            : initialCompareFrom
                }
                : undefined
        )
        setIsOpen(false)
    }
    useEffect(() => {
        checkPreset()
    }, [range])
    const PresetButton = ({
                              preset,
                              label,
                              isSelected
                          }) => (
        <Button
            className={`${isSelected ? 'pointer-events-none bg-primary/15 text-primary font-medium' : 'font-normal'}  justify-between hover:bg-primary/5 p-2`}
            variant="ghost" size={"sm"}
            onClick={() => {
                setPreset(preset, label);
            }}
        >
            {label}
            {isSelected && <CheckIcon className="mr-2 h-4 w-4" />}
        </Button>
    )
    const onApplyDate = () => {
        setIsOpen(false)
        onUpdate?.(range)
        setIsApply(true)
        setTempLabel(label)
        setTempRange({
            from: range.from,
            to: range.to
        })
    }
    const onOpenDatePicker = (open) => {
        setIsOpen(open)
        setIsApply(false)
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-end gap-2 justify-end">
                <Popover open={isOpen} onOpenChange={onOpenDatePicker}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between cursor-pointer">
              <span>
                 {/*{(!isApply && label !== '') ? tempLabel !== '' ? tempLabel : <Fragment>{(tempRange.from ? formatDate(tempRange.from, locale) : 'Pick a date')} {tempRange.to && ` - ${formatDate(tempRange.to, locale)}`}</Fragment> : label !== '' ? label : <Fragment>{(range.from ? formatDate(range.from, locale) : 'Pick a date')} {range.to && ` - ${formatDate(range.to, locale)}`}</Fragment>}*/}
                  {(!isApply && label !== '')
                      ? tempLabel !== ''
                          ? tempLabel
                          : <Fragment>
                              {(tempRange.from ? moment(tempRange.from).format("MMM D, YYYY") : 'Pick a date')}
                              {tempRange.to && ` - ${moment(tempRange.to).format("MMM D, YYYY")}`}
                          </Fragment>
                      : label !== ''
                          ? label
                          : <Fragment>
                              {(range.from ? moment(range.from).format("MMM D, YYYY") : 'Pick a date')}
                              {range.to && ` - ${moment(range.to).format("MMM D, YYYY")}`}
                          </Fragment>
                  }

              </span>
                            {isOpen ? (
                                <ChevronUpIcon className="ml-2 h-4 w-4" />
                            ) : (
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align={align} className="w-auto">
                        <div className="flex border-b mb-4 pb-1">
                            {!isSmallScreen && (
                                <div className="flex pr-4 flex-col w-[200px] gap-0.5">
                                    {PRESETS.map((preset) => (
                                        <PresetButton
                                            key={preset.name}
                                            preset={preset.name}
                                            label={preset.label}
                                            isSelected={selectedPreset === preset.name}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="flex">
                                <div className="flex flex-col">
                                    { isSmallScreen && (
                                        <Select defaultValue={selectedPreset} onValueChange={(value) => { setPreset(value) }}>
                                            <SelectTrigger className="w-[100%] mx-auto mb-2">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRESETS.map((preset) => (
                                                    <SelectItem key={preset.name} value={preset.name}>
                                                        {preset.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <div>
                                        <Calendar
                                            mode="range"
                                            className={"p-0"}
                                            disabled={{from:new Date().setDate(new Date().getDate() + 1), to:new Date(2050, 12,31)}}
                                            onSelect={(value) => {
                                                if (value?.from != null) {
                                                    setRange({ from: value.from, to: value?.to })
                                                }
                                            }}
                                            selected={range}
                                            numberOfMonths={isSmallScreen ? 1 : 2}
                                            startMonth={new Date(2024, 0)}
                                            endMonth={new Date(2050, 12)}
                                            showOutsideDays={false}
                                            defaultMonth={
                                                new Date(
                                                    new Date().setMonth(
                                                        new Date().getMonth() - (isSmallScreen ? 0 : 1)
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2  pr-4">
                            <Button
                                size={"sm"}
                                onClick={() => {
                                    resetValues()
                                }}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                            <Button size={"sm"}
                                    onClick={onApplyDate}>
                                Apply
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
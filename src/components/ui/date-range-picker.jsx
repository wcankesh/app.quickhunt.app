import React, {useEffect, useRef, useState} from 'react'
import {Button} from './button'
import {Popover, PopoverContent, PopoverTrigger} from './popover'
import {cn} from "../../lib/utils"
import {DateInput} from './date-input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './select'
import {Calendar} from './calendar'
import {ChevronDownIcon, ChevronUpIcon} from '@radix-ui/react-icons'


const formatDate = (date, locale = 'en-us') => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput) => {
    if (typeof dateInput === 'string') {
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        return dateInput
    }
}

const PRESETS = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 days' },
    { name: 'last14', label: 'Last 14 days' },
    { name: 'last30', label: 'Last 30 days' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'thisMonth', label: 'This Month' },
    { name: 'lastMonth', label: 'Last Month' }
]

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

    const [range, setRange] = useState({
        from: initialDateFrom,
        to: initialDateTo
    })

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

    const openedRangeRef = useRef()
    const openedRangeCompareRef = useRef()

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

    const getPresetRange = (presetName) => {
        const preset = PRESETS.find(({ name }) => name === presetName)
        if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
        const from = new Date()
        const to = new Date()
        const first = from.getDate() - from.getDay()

        switch (preset.name) {
            case 'today':
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'yesterday':
                from.setDate(from.getDate() - 1)
                from.setHours(0, 0, 0, 0)
                to.setDate(to.getDate() - 1)
                to.setHours(23, 59, 59, 999)
                break
            case 'last7':
                from.setDate(from.getDate() - 6)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'last14':
                from.setDate(from.getDate() - 13)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'last30':
                from.setDate(from.getDate() - 29)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'thisWeek':
                from.setDate(first)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'lastWeek':
                from.setDate(from.getDate() - 7 - from.getDay())
                to.setDate(to.getDate() - to.getDay() - 1)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'thisMonth':
                from.setDate(1)
                from.setHours(0, 0, 0, 0)
                to.setHours(23, 59, 59, 999)
                break
            case 'lastMonth':
                from.setMonth(from.getMonth() - 1)
                from.setDate(1)
                from.setHours(0, 0, 0, 0)
                to.setDate(0)
                to.setHours(23, 59, 59, 999)
                break
        }

        return { from, to }
    }

    const setPreset = (preset) => {
        const range = getPresetRange(preset)
        setRange(range)
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
                return
            }
        }

        setSelectedPreset(undefined)
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
            className={`${cn(isSelected && 'pointer-events-none bg-primary/15 text-primary')} justify-start p-2`}
            variant="ghost" size={"sm"}
            onClick={() => {
                setPreset(preset)
            }}
        >
            {/*{isSelected && <CheckIcon className="mr-2 h-4 w-4" />}*/}
            {label}
        </Button>
    )

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-end gap-2 justify-end">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[300px] justify-between">
              <span>
                {range.from ? formatDate(range.from, locale) : 'Pick a date'}
                  {range.to && ` - ${formatDate(range.to, locale)}`}
              </span>
                            {isOpen ? (
                                <ChevronUpIcon className="ml-2 h-4 w-4" />
                            ) : (
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align={align} className="w-auto">
                        <div className="flex pb-2">
                            {!isSmallScreen && (
                                <div className="flex flex-col gap-1 pr-2 ">
                                    <div className="flex w-full flex-col pr-2 gap-1">
                                        {PRESETS.map((preset) => (
                                            <PresetButton
                                                key={preset.name}
                                                preset={preset.name}
                                                label={preset.label}
                                                isSelected={selectedPreset === preset.name}
                                            />
                                        ))}
                                    </div>
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
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                            <Button size={"sm"}
                                onClick={() => {
                                    setIsOpen(false)
                                    onUpdate?.(range)
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

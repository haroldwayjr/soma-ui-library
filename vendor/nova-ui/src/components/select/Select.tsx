import type { SelectRootChangeEventDetails } from '@base-ui/react/select'
import type { CSSProperties, ReactElement, Ref } from 'react'

import { Select as BaseSelect } from '@base-ui/react/select'

import type { SelectSize } from './Select.css'

import { cx } from '../../helper/cx'
import { portalLayerStyle } from '../../styles/layer.css'
import { useFieldControlProps } from '../field'
import { Check } from './Check'
import { ChevronDown } from './ChevronDown'
import {
  chevronStyle,
  itemIndicatorStyle,
  itemStyle,
  itemTextStyle,
  listStyle,
  popupStyle,
  triggerRecipe,
  valueStyle,
} from './Select.css'

/** The change reason Base UI reports alongside a new value. */
export type SelectChangeEventDetails = SelectRootChangeEventDetails

export interface SelectItem<T extends string> {
  /** Renders an unselectable option. Selection is blocked by Base UI, not by us. */
  disabled?: boolean | undefined
  label: string
  value: T
}

/**
 * `T` is constrained to `string` where Base UI leaves its `Value` parameter
 * unconstrained. The hidden input submits a string, so an object value would
 * either serialize as `[object Object]` or force Base UI's `itemToString*`
 * escape hatches, which this component deliberately does not expose. A consumer
 * with numeric ids stringifies at the edge, which is where the parse belongs.
 */
export interface SelectProps<T extends string> {
  /**
   * Names the trigger when there is no surrounding `Field`. Required in that
   * case: a `<label>` associates with the trigger for click-to-focus, but a
   * button's accessible name comes from its own content — here the selected
   * value — so the field would announce "Alex Rivera" rather than "Assignee".
   * Inside a `Field`, Base UI sets `aria-labelledby` and neither is needed.
   */
  'aria-label'?: string | undefined
  'aria-labelledby'?: string | undefined
  // Optionals accept an explicit `undefined` — matching Base UI's own prop types
  // — so `SelectField` can forward "not set" without a conditional spread for
  // every prop under `exactOptionalPropertyTypes`.
  /** Placement only. Lands on the trigger — Select renders no wrapper element. */
  className?: string | undefined
  defaultValue?: null | T | undefined
  disabled?: boolean | undefined
  items: readonly SelectItem<T>[]
  name?: string | undefined
  /**
   * Ships with `value`, or use `readOnly` for a deliberately fixed value. The
   * `details` argument is Base UI's; `details.reason` distinguishes a user's
   * `itemPress` from `listNavigation` or a programmatic `none`. See
   * `docs/CONTROLLED-STATE.md`.
   */
  onValueChange?:
    ((value: null | T, details: SelectChangeEventDetails) => void) | undefined
  /** Shown when there is no value. Not a substitute for a label. */
  placeholder?: string | undefined
  /** Keeps the trigger focusable and submitting; the popup does not open. */
  readOnly?: boolean | undefined
  /** Lands on the trigger button, not the root or the popup. */
  ref?: Ref<HTMLButtonElement> | undefined
  /** Trigger height only. Items stay 36px in both. */
  size?: SelectSize | undefined
  style?: CSSProperties | undefined
  value?: null | T | undefined
}

export function Select<T extends string>({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  defaultValue,
  disabled = false,
  items,
  name,
  onValueChange,
  placeholder,
  readOnly = false,
  ref,
  size = 'medium',
  style,
  value,
}: SelectProps<T>): ReactElement {
  // The ONLY thing this hook supplies is `aria-required` — `Field.Root` has no
  // `required` prop, and Nova does not set the native attribute, so this is the
  // one bridge `indicateRequired` needs to reach a control.
  //
  // Invalid, disabled, and the label ID come from Base UI's own FieldRootContext,
  // which `Select.Trigger` reads by itself. Do not reimplement them here.
  const controlProps = useFieldControlProps()

  return (
    <BaseSelect.Root<T>
      defaultValue={defaultValue}
      disabled={disabled}
      // Base UI's own label resolution: the trigger's Value renders while the
      // popup is unmounted, so it cannot read the labels off the Item children.
      items={items}
      // Base UI defaults this to `true`, which locks page scroll. A select is not
      // modal. Pinned rather than exposed — omitting it is not the same as
      // absence.
      modal={false}
      name={name}
      onValueChange={onValueChange}
      readOnly={readOnly}
      // Never set: `indicateRequired` publishes `aria-required` through the hook
      // above, and native `required` would let the browser block submission and
      // show its own bubble before the form layer renders `error`.
      required={false}
      value={value}
    >
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cx(triggerRecipe({ size }), className)}
        ref={ref}
        style={style}
        // After the spread-free explicit props above, this is what stops a leaked
        // `aria-required` from disagreeing with the label asterisk.
        {...controlProps}
      >
        {/* Renders `role="combobox"`, not `role="button"`: the element is a
            button, the role is not. Query it as `combobox`. */}
        <BaseSelect.Value className={valueStyle} placeholder={placeholder} />
        <BaseSelect.Icon className={chevronStyle}>
          <ChevronDown />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      {/* The stacking order goes on the Portal, not the Positioner — ADR 0004.
          Without it the popup has no z-index at all and works only for as long
          as nothing else in the document competes. */}
      <BaseSelect.Portal className={portalLayerStyle.dropdown}>
        {/* `alignItemWithTrigger` also defaults to `true`, which overlays the
            selected item onto the trigger. The masters place the popup below it. */}
        <BaseSelect.Positioner alignItemWithTrigger={false} sideOffset={4}>
          <BaseSelect.Popup className={popupStyle}>
            <BaseSelect.List className={listStyle}>
              {items.map((item) => (
                <BaseSelect.Item
                  className={itemStyle}
                  disabled={item.disabled ?? false}
                  key={item.value}
                  value={item.value}
                >
                  <BaseSelect.ItemText className={itemTextStyle}>
                    {item.label}
                  </BaseSelect.ItemText>
                  {/* Mounted only when selected, so an unselected row reserves no
                      gap and the label does not shift between the two states. */}
                  <BaseSelect.ItemIndicator className={itemIndicatorStyle}>
                    <Check />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}

import { AntDesign } from "@expo/vector-icons"
import { useButton } from "@react-native-aria/button"
import { useComboBox } from "@react-native-aria/combobox"
import { useListBox, useOption } from "@react-native-aria/listbox"
import { Item } from "@react-stately/collections"
import { ComboBoxState, useComboBoxState } from "@react-stately/combobox"
import { Box, Input, Pressable, Text, themeTools, useThemeProps } from "native-base"
import type {
  IComboBoxProps,
  ITypeaheadProps,
} from "native-base/lib/typescript/components/composites/Typeahead/types"
import React from "react"
import { findNodeHandle, Platform, TextInput, TextInputProps } from "react-native"
import BigList from "react-native-big-list"
import { spacing } from "../../theme"

// eslint-disable-next-line react/display-name
export const Select = React.forwardRef(
  (
    {
      onSelectedItemChange,
      options,
      renderItem,
      getOptionLabel,
      getOptionKey,
      onChange,
      numberOfItems,
      ...rest
    }: ITypeaheadProps & { labelInline?: boolean } & Partial<
        Omit<TextInputProps, "onFocus" | "onBlur" | "onChange">
      >,
    ref?: any,
  ) => {
    return (
      <ComboBoxImplementation
        {...rest}
        onSelectionChange={onSelectedItemChange}
        items={numberOfItems !== undefined ? options.slice(0, numberOfItems) : options}
        onInputChange={onChange}
        ref={ref}
      >
        {(item: any) => {
          if (typeof item !== "string" && getOptionLabel === undefined) {
            throw new Error("Please use getOptionLabel prop")
          }

          if (item.id === undefined && getOptionKey === undefined) {
            throw new Error("Please use getOptionKey prop")
          }

          const optionLabel = getOptionLabel ? getOptionLabel(item) : item
          const optionKey = getOptionKey
            ? getOptionKey(item)
            : item.id !== undefined
            ? item.id
            : optionLabel

          return (
            <Item textValue={optionLabel} key={optionKey}>
              {renderItem ? (
                renderItem(item)
              ) : (
                <Box p={2} justifyContent="center">
                  <Text>{optionLabel}</Text>
                </Box>
              )}
            </Item>
          )
        }}
      </ComboBoxImplementation>
    )
  },
)

export const layoutPropsList = [
  "m",
  "mt",
  "mb",
  "ml",
  "mr",
  "p",
  "pt",
  "pb",
  "pl",
  "pr",
  "position",
  "flex",
  "zIndex",
  "top",
  "right",
  "bottom",
  "left",
  "h",
  "w",
  "minW",
  "maxW",
  "minH",
  "maxH",
  "height",
  "width",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "direction",
  "justify",
  "justifyContent",
  "align",
  "alignContent",
  "alignItems",
  "alignSelf",
]

const ComboBoxImplementation = React.forwardRef(
  (
    props: Partial<Omit<TextInputProps, "onFocus" | "onBlur">> &
      IComboBoxProps & { labelInline?: boolean },
    ref?: any,
  ) => {
    const [layoutProps] = themeTools.extractInObject(props, layoutPropsList)
    const state = useComboBoxState(props)

    const triggerRef = React.useRef(null)
    const inputRef = React.useRef(null)
    const listBoxRef = React.useRef(null)
    const popoverRef = React.useRef(null)

    const {
      buttonProps: triggerProps,
      inputProps,
      listBoxProps,
      labelProps,
    } = useComboBox(
      {
        ...props,
        inputRef,
        buttonRef: triggerRef,
        listBoxRef,
        popoverRef,
        menuTrigger: "input",
      },
      state,
    )

    const toggleIconSetter = () => {
      if (typeof props.toggleIcon === "function")
        return props.toggleIcon({
          isOpen: state.isOpen,
        })
      return props.toggleIcon
    }

    const { buttonProps } = useButton(triggerProps)

    const input = (
      <Input
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        {...inputProps}
        placeholder={props.placeholder}
        ref={inputRef}
        InputLeftElement={
          <AntDesign
            name="search1"
            size={14}
            color={props.placeholderTextColor}
            style={{ paddingLeft: spacing[3] }}
          />
        }
        InputRightElement={
          <Pressable {...buttonProps} ref={triggerRef}>
            {toggleIconSetter()}
          </Pressable>
        }
        onEndEditing={(e) => {
          const text = e.nativeEvent.text
          const selected = state.selectionManager.firstSelectedKey
          const firstKey = state.collection.getFirstKey()
          if (text && !selected && firstKey) {
            state.selectionManager.select(firstKey)
          }
        }}
      />
    )

    const listBoxPopup = (
      <ListBoxPopup
        {...listBoxProps}
        listBoxRef={listBoxRef}
        popoverRef={popoverRef}
        state={state}
        label={props.label}
        inputRef={inputRef}
      />
    )

    return (
      <Box flexDirection="row" {...layoutProps} ref={ref}>
        <Box
          flex={1}
          {...(props.labelInline ? { flexDirection: "row", justifyContent: "space-between" } : {})}
        >
          {props.label && (
            <Text
              {...labelProps}
              pb={1}
              {...(props.labelInline
                ? { alignContent: "flex-start", alignSelf: "center", pr: 2, ml: -1 }
                : {})}
            >
              {props.label}
            </Text>
          )}
          {props.labelInline ? (
            <Box flex={1} flexDirection="column">
              {input}
              {state.isOpen && listBoxPopup}
            </Box>
          ) : (
            <>
              {input}
              {state.isOpen && listBoxPopup}
            </>
          )}
        </Box>
      </Box>
    )
  },
)

type IListBoxProps = {
  popoverRef: any
  listBoxRef: any
  state: ComboBoxState<any>
  dropdownHeight: number
  label: string
  inputRef: React.RefObject<TextInput>
}

function ListBoxPopup(props: IListBoxProps) {
  const { popoverRef, listBoxRef, state, dropdownHeight, label, inputRef } = props

  const { listBoxProps } = useListBox(
    {
      label,
      autoFocus: state.focusStrategy,
      disallowEmptySelection: true,
      isVirtualized: true,
    },
    state,
    listBoxRef,
  )

  return (
    <Box ref={popoverRef}>
      <Box position="absolute" width="100%" maxHeight={dropdownHeight ?? 250}>
        <BigList
          {...listBoxProps}
          style={{ height: dropdownHeight ?? 250 }}
          itemHeight={32}
          windowSize={10}
          ref={(node) => {
            if (Platform.OS === "web") {
              listBoxRef.current = findNodeHandle(node)
            } else {
              listBoxRef.current = node
            }
          }}
          data={[...state.collection]}
          renderItem={(i) => {
            return <Option key={i.item.key} item={i.item} state={state} inputRef={inputRef} />
          }}
        />
      </Box>
    </Box>
  )
}

function Option({
  item,
  state,
  inputRef,
}: {
  item: any
  state: ComboBoxState<any>
  inputRef: React.RefObject<TextInput>
}) {
  const searchItemStyle = useThemeProps("TypeAheadSearchItem", {})

  const ref = React.useRef(null)
  const isDisabled = state.disabledKeys.has(item.key)
  const isSelected = state.selectionManager.isSelected(item.key)
  const isFocused = state.selectionManager.focusedKey === item.key

  const { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      shouldFocusOnHover: true,
      shouldUseVirtualFocus: true,
    },
    state,
    ref,
  )

  let backgroundColor = searchItemStyle.backgroundColor
  let opacity = 1

  if (isSelected) {
    backgroundColor = searchItemStyle._focus.backgroundColor
  } else if (isFocused) {
    backgroundColor = searchItemStyle._focus.backgroundColor
  } else if (isDisabled) {
    opacity = 0.6
    backgroundColor = searchItemStyle._disabled.backgroundColor
  }

  return (
    <Pressable
      {...optionProps}
      opacity={opacity}
      cursor={isDisabled ? (Platform.OS === "web" ? "not-allowed" : null) : null}
      backgroundColor={backgroundColor}
      ref={ref}
      onResponderEnd={(_e) => {
        inputRef.current?.blur()
      }}
    >
      {item.rendered}
    </Pressable>
  )
}

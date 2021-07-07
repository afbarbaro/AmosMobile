import React from 'react';
import { useButton } from '@react-native-aria/button';
import { ComboBoxState, useComboBoxState } from '@react-stately/combobox';
import { useComboBox } from '@react-native-aria/combobox';
import { useListBox, useOption } from '@react-native-aria/listbox';
import { ScrollView, findNodeHandle, Platform, TextInput } from 'react-native';
import { Item } from '@react-stately/collections';
import { Box, Input, Text, Pressable, useThemeProps, themeTools } from 'native-base';
import type { ITypeaheadProps, IComboBoxProps } from 'native-base/lib/typescript/components/composites/Typeahead/types';

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
    }: ITypeaheadProps,
    ref?: any
  ) => {
    return (
      <ComboBoxImplementation
        {...rest}
        onSelectionChange={onSelectedItemChange}
        items={
          numberOfItems !== undefined
            ? options.slice(0, numberOfItems)
            : options
        }
        onInputChange={onChange}
        ref={ref}
      >
        {(item: any) => {
          if (typeof item !== 'string' && getOptionLabel === undefined) {
            throw new Error('Please use getOptionLabel prop');
          }

          if (item.id === undefined && getOptionKey === undefined) {
            throw new Error('Please use getOptionKey prop');
          }

          const optionLabel = getOptionLabel ? getOptionLabel(item) : item;
          const optionKey = getOptionKey
            ? getOptionKey(item)
            : item.id !== undefined
              ? item.id
              : optionLabel;

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
          );
        }}
      </ComboBoxImplementation>
    );
  }
);

export const layoutPropsList = [
  'm',
  'mt',
  'mb',
  'ml',
  'mr',
  'p',
  'pt',
  'pb',
  'pl',
  'pr',
  'position',
  'flex',
  'zIndex',
  'top',
  'right',
  'bottom',
  'left',
  'h',
  'w',
  'minW',
  'maxW',
  'minH',
  'maxH',
  'height',
  'width',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'direction',
  'justify',
  'justifyContent',
  'align',
  'alignContent',
  'alignItems',
  'alignSelf',
];

const ComboBoxImplementation = React.forwardRef(
  (props: IComboBoxProps, ref?: any) => {
    const [layoutProps] = themeTools.extractInObject(props, layoutPropsList);
    const state = useComboBoxState(props);

    const triggerRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const listBoxRef = React.useRef(null);
    const popoverRef = React.useRef(null);

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
        menuTrigger: 'input',
      },
      state
    );

    const toggleIconSetter = () => {
      if (typeof props.toggleIcon === 'function')
        return props.toggleIcon({
          isOpen: state.isOpen,
        });
      return props.toggleIcon;
    };

    const { buttonProps } = useButton(triggerProps);

    return (
      <Box flexDirection="row" {...layoutProps} ref={ref}>
        <Box flex={1}>
          {props.label && (
            <Text {...labelProps} pb={1}>
              {props.label}
            </Text>
          )}
          <Input
            {...inputProps}
            ref={inputRef}
            InputRightElement={
              <Pressable {...buttonProps} ref={triggerRef}>
                {toggleIconSetter()}
              </Pressable>
            }
          />

          {state.isOpen && (
            <ListBoxPopup
              {...listBoxProps}
              listBoxRef={listBoxRef}
              popoverRef={popoverRef}
              state={state}
              label={props.label}
              inputRef={inputRef}
            />
          )}
        </Box>
      </Box>
    );
  }
);

type IListBoxProps = {
  popoverRef: any;
  listBoxRef: any;
  state: ComboBoxState<any>;
  dropdownHeight: number;
  label: string;
  inputRef: React.RefObject<TextInput>
};

function ListBoxPopup(props: IListBoxProps) {
  const { popoverRef, listBoxRef, state, dropdownHeight, label, inputRef } = props;

  const { listBoxProps } = useListBox(
    {
      label,
      autoFocus: state.focusStrategy,
      disallowEmptySelection: true,
      isVirtualized: true,
    },
    state,
    listBoxRef
  );

  return (
    <Box ref={popoverRef}>
      <Box position="absolute" width="100%" maxHeight={dropdownHeight ?? 200}>
        <ScrollView
          {...listBoxProps}
          keyboardShouldPersistTaps="handled"
          ref={(node) => {
            if (Platform.OS === 'web') {
              listBoxRef.current = findNodeHandle(node);
            } else {
              listBoxRef.current = node;
            }
          }}
        >
          {[...state.collection].map((item) => (
            <Option key={item.key} item={item} state={state} inputRef={inputRef} />
          ))}
        </ScrollView>
      </Box>
    </Box>
  );
}

function Option({ item, state, inputRef }: { item: any; state: ComboBoxState<any>, inputRef: React.RefObject<TextInput> }) {
  const searchItemStyle = useThemeProps('TypeAheadSearchItem', {});

  const ref = React.useRef(null);
  const isDisabled = state.disabledKeys.has(item.key);
  const isSelected = state.selectionManager.isSelected(item.key);
  const isFocused = state.selectionManager.focusedKey === item.key;

  const { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      shouldFocusOnHover: true,
      shouldUseVirtualFocus: true,
    },
    state,
    ref
  );

  let backgroundColor = searchItemStyle.backgroundColor;
  let opacity = 1;

  if (isSelected) {
    backgroundColor = searchItemStyle._focus.backgroundColor;
  } else if (isFocused) {
    backgroundColor = searchItemStyle._focus.backgroundColor;
  } else if (isDisabled) {
    opacity = 0.6;
    backgroundColor = searchItemStyle._disabled.backgroundColor;
  }

  return (
    <Pressable
      {...optionProps}
      opacity={opacity}
      cursor={
        isDisabled ? (Platform.OS === 'web' ? 'not-allowed' : null) : null
      }
      backgroundColor={backgroundColor}
      ref={ref}
      onResponderEnd={(_e) => { inputRef.current?.blur(); }}
    >
      {item.rendered}
    </Pressable>
  );
}

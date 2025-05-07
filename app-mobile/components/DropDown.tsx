import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

 export type DropDownData<T> = {
    label: string;
    value: T;
};

export interface DropDownProps<T> {
    data: DropDownData<T>[];
    onChange: (item: DropDownData<T>) => void;
    value?: T;
    placeholder?: string;
    label?: string;
    searchField?: string;
    search?: boolean;
    searchPlaceholder?: string;
    searchPlaceholderTextColor?: string;
    disable?: boolean;
    autoScroll?: boolean;
    showLeftIcon?: boolean;
    height?: number;
}

  const DropdownComponent = <T,>(props: DropDownProps<T>) => {
    const [value, setValue] = useState<T | null>(null);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => setValue(props.value!), [props.value]);

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            {props.label || 'Select item'}
          </Text>
        );
      }
      return null;
    };

    return (
      <View >
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={props.data}
          maxHeight={props.height || 300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? props.placeholder : '...'}
          search={props.search}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            props.onChange(item);
          }}
          renderLeftIcon={() => (
            props.showLeftIcon ? (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="qrcode"
              size={20}
            />
          ) : <></> )}
        />
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      marginVertical: 16,
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });
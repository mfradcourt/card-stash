import { Text, TextInput, View } from "react-native";

export interface Input {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
}

const Input: React.FC<Input> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={typeof value === 'string' ? value : ''}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default Input;

const styles = {
    container: {
        marginBottom: 16,
    },  
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
    },
    label: {
        marginBottom: 16,
    },
};
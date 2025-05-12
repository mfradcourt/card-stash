import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled,
    loading
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.button, disabled && styles.disabledButton]}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

export default Button;
const styles = StyleSheet.create({
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },  
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});
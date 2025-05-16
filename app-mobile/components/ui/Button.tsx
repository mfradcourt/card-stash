import { ReactElement } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonProps {
    title: string;
    icon?: ReactElement;
    iconPosition?: 'left' | 'right';
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: object;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled,
    loading,
    icon,
    iconPosition = 'left',
    style,
}) => {
    return (
        <TouchableOpacity
            
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.button, style, disabled && styles.disabledButton]}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={styles.buttonText}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </View>
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
        marginVertical: 16,
        width: '100%',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});
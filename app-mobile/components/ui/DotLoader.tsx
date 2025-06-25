import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export default function DotLoader({ size = 10, color = "#000", spacing = 6 }) {
  // Create animated values for each dot
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Helper to build a single bounce animation sequence
  const bounce = (animatedValue: Animated.Value, delay = 0) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    const a1 = bounce(dot1, 50);
    const a2 = bounce(dot2, 100);
    const a3 = bounce(dot3, 150);

    // Start all animations together
    a1.start();
    a2.start();
    a3.start();

    // Clean up on unmount
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const dotStyle = (animated) => ({
    width: size,
    height: size,
    marginHorizontal: spacing / 2,
    borderRadius: size / 2,
    backgroundColor: color,
    transform: [
      {
        translateY: animated.interpolate({
          inputRange: [0, 1.5],
          outputRange: [0, size],
        }),
      },
    ],
  });

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <Animated.View style={dotStyle(dot1)} />
      <Animated.View style={dotStyle(dot2)} />
      <Animated.View style={dotStyle(dot3)} />
    </View>
  );
}

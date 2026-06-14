import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

export default function ProductImage({ product, style }) {
  const [source, setSource] = useState(product.image);
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const { resizeMode, ...imageStyle } = flattenedStyle;

  useEffect(() => {
    setSource(product.image);
  }, [product.image]);

  return (
    <Image
      onError={() => setSource(product.fallbackImage)}
      resizeMode={resizeMode}
      source={{ uri: source || product.fallbackImage }}
      style={imageStyle}
    />
  );
}

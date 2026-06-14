import React, { useEffect, useState } from "react";
import { Image } from "react-native";

export default function ProductImage({ product, style }) {
  const [source, setSource] = useState(product.image);

  useEffect(() => {
    setSource(product.image);
  }, [product.image]);

  return (
    <Image
      onError={() => setSource(product.fallbackImage)}
      source={{ uri: source || product.fallbackImage }}
      style={style}
    />
  );
}

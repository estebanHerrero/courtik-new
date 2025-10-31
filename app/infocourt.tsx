// app/infocourt.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AppText from "../components/AppText"; // si usas tu componente AppText

const { width } = Dimensions.get("window");

// Datos de ejemplo (puedes mover esto a un archivo separado o reemplazar por fetch)
const canchasData = [
  { id: 1, nombre: "World Padel Center CABA", direccion: "Dr. Luis Beláustegui 3041", precio: 20000, tipo: "Indoor", imagen: require("../assets/court1.jpg"), latitude: -34.6037, longitude: -58.3816, rating: 4.5, reviews: 128, descripcion: "Descripción ejemplo", images: [require("../assets/court1.jpg"), require("../assets/court2.jpg")] },
  { id: 2, nombre: "Lasaigues Padel Sheraton", direccion: "Dr. Luis Beláustegui 3041", precio: 18000, tipo: "Outdoor", imagen: require("../assets/court2.jpg"), latitude: -34.6040, longitude: -58.3820, rating: 4.2, reviews: 42, descripcion: "Otra descripción", images: [require("../assets/court2.jpg")] },
  // ...
];

export default function Infocourt() {
  const { id } = useSearchParams(); // lee ?id=2
  const router = useRouter();
        
  // Buscar cancha por id (asegurarse que id sea number)
  const courtId = id ? parseInt(id as string, 10) : null;
  const court = useMemo(() => canchasData.find(c => c.id === courtId) ?? canchasData[0], [courtId]);

  // Region para el mapa (fallback a coordenadas por defecto si no existen)
  const region = {
    latitude: court.latitude ?? -34.6037,
    longitude: court.longitude ?? -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  if (!court) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la cancha</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={court.imagen} style={styles.mainImage} />

      <View style={styles.header}>
        <AppText variant="semibold" style={styles.title}>{court.nombre}</AppText>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#555" />
          <AppText style={styles.address}>{court.direccion}</AppText>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star-half" size={14} color="#FFD700" />
          <Ionicons name="star-outline" size={14} color="#FFD700" />
          <AppText style={styles.ratingText}>{court.rating} ({court.reviews})</AppText>
        </View>
      </View>

      <AppText style={styles.description}>{court.descripcion}</AppText>

      <FlatList
        horizontal
        data={court.images}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <Image source={item} style={styles.carouselImage} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16 }}
      />

      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={region}>
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title={court.nombre} description={court.direccion} />
        </MapView>
      </View>

      <View style={styles.servicesContainer}>
        {/* Ejemplo de servicios */}
        <View style={styles.serviceRow}>
          <Ionicons name="home-outline" size={18} color="#00AEEF" />
          <AppText style={styles.serviceText}>Indoor</AppText>
        </View>
        <View style={styles.serviceRow}>
          <Ionicons name="sunny-outline" size={18} color="#FF9800" />
          <AppText style={styles.serviceText}>Outdoor</AppText>
        </View>
        <View style={styles.serviceRow}>
          <Ionicons name="car-outline" size={18} color="#666" />
          <AppText style={styles.serviceText}>Estacionamiento</AppText>
        </View>
        {/* agrega más servicios/íconos según necesites */}
      </View>

      <TouchableOpacity style={styles.reserveBtn} onPress={() => {/* navegar a reserva */}}>
        <AppText variant="semibold" style={styles.reserveBtnText}>Reservar</AppText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mainImage: { width: width, height: 260 },
  header: { padding: 16 },
  title: { fontSize: 22, color: "#0B0F14" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  address: { marginLeft: 8, color: "#666" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { marginLeft: 8, color: "#666" },
  description: { paddingHorizontal: 16, color: "#333", fontSize: 15, marginBottom: 12 },
  carouselImage: { width: width * 0.8, height: 150, marginRight: 12, borderRadius: 12 },
  mapContainer: { height: 200, marginHorizontal: 16, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  map: { flex: 1 },
  servicesContainer: { paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  serviceRow: { flexDirection: "row", alignItems: "center", marginRight: 16, marginBottom: 12 },
  serviceText: { marginLeft: 8, color: "#555" },
  reserveBtn: { backgroundColor: "#00AEEF", marginHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 40 },
  reserveBtnText: { color: "#fff" },
});
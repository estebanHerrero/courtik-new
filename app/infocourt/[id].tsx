// app/infocourt/[id].tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import AppText from "../../components/AppText";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 320;

export default function InfoCourtScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [court, setCourt] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Map module state (carga dinámica)
  const [MapModule, setMapModule] = useState<any | null>(null);
  useEffect(() => {
    // Intentamos importar react-native-maps dinámicamente.
    // Si no está instalado o no puede cargarse (Expo Go sin dev-client), ignoramos.
    let mounted = true;
    import("react-native-maps")
      .then((mod) => { if (mounted) setMapModule(mod); })
      .catch(() => { /* no hay MapView disponible */ });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const parsedId = parseInt(id as any, 10);
      const { data, error } = await supabase
        .from("courts")
        .select("*")
        .eq("id", parsedId)
        .single();
      if (error) {
        console.error("Supabase fetch error:", error);
        setCourt(null);
      } else {
        setCourt(data);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 40 }} />;

  if (!court) {
    return (
      <View style={styles.empty}>
        <AppText>No se encontró la cancha</AppText>
        <TouchableOpacity onPress={() => router.back()} style={styles.goBackBtn}>
          <AppText style={{ color: "#fff" }}>Volver</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const images = court.images && court.images.length ? court.images : [];
  const lat = typeof court.latitude === "number" ? court.latitude : parseFloat(court.latitude);
  const lng = typeof court.longitude === "number" ? court.longitude : parseFloat(court.longitude);
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lng);

  // Abrir en Google Maps / Apple Maps
  const openInMaps = () => {
    if (!hasCoords) return;
    const label = encodeURIComponent(court.nombre || "Cancha");
    const latlng = `${lat},${lng}`;
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${latlng}&q=${label}`
        : `https://www.google.com/maps/search/?api=1&query=${latlng}`;
    Linking.openURL(url).catch((err) => console.error("Error opening maps:", err));
  };

  const MapView = MapModule?.default;
  const Marker = MapModule?.Marker ?? MapModule?.default?.Marker ?? MapModule?.default?.Marker;

  return (
    <View style={styles.container}>
      {/* HEADER IMAGE + GRADIENT */}
      <View style={styles.headerContainer}>
        {images[0] ? (
          <Image source={{ uri: images[0] }} style={styles.headerImage} />
        ) : (
          <View style={[styles.headerImage, styles.headerNoImage]}>
            <Ionicons name="image-outline" size={64} color="#fff" />
          </View>
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={styles.gradient}
          start={[0.5, 0.1]}
          end={[0.5, 1]}
        />

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.headerContent}>
          <AppText variant="semibold" style={styles.title} numberOfLines={2}>
            {court.nombre}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons name="location-outline" size={16} color="#fff" />
              <AppText style={styles.locationText}>{court.direccion}</AppText>
            </View>

            <View style={styles.rating}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {renderStars(court.rating)}
                <AppText style={styles.ratingNumber}>{court.rating ?? "-"}</AppText>
              </View>
              <AppText style={styles.reviews}> ({court.reviews ?? 0})</AppText>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
        <AppText style={styles.description}>{court.descripcion ?? "Descripción no disponible."}</AppText>

        {/* Carrusel simple */}
        <View style={styles.carouselWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8 + 16}
            decelerationRate="fast"
            pagingEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {(images.length ? images : []).map((img: string, i: number) => (
              <View key={i} style={styles.carouselCard}>
                <Image source={{ uri: img }} style={styles.carouselImage} />
              </View>
            ))}
          </ScrollView>
        </View>

        <AppText variant="semibold" style={styles.sectionTitle}>Servicios</AppText>
        <View style={styles.servicesGrid}>
          {serviceItemsFromCourt(court).map((s) => (
            <View key={s.key} style={styles.serviceItem}>
              <View style={styles.serviceIcon}>
                {s.icon}
              </View>
              <AppText style={styles.serviceLabel}>{s.label}</AppText>
            </View>
          ))}
        </View>

        {/* MAP / FALLBACK */}
        <AppText variant="semibold" style={[styles.sectionTitle, { marginTop: 6 }]}>Ubicación</AppText>

        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          {MapView && hasCoords ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.005 * (1 + (1)),
                longitudeDelta: 0.005 * (1 + (1)),
              }}
              scrollEnabled={true}
              zoomEnabled={true}
            >
              {Marker ? (
                <Marker coordinate={{ latitude: lat, longitude: lng }} />
              ) : (
                <MapView.Marker coordinate={{ latitude: lat, longitude: lng }} />
              )}
            </MapView>
          ) : hasCoords ? (
            // Fallback visual (sin MapView) — imagen estática generada por Google Static Maps sería mejor con API KEY,
            // aquí mostramos un placeholder y damos botón para abrir en Maps.
            <View style={styles.mapFallback}>
              <Ionicons name="map-outline" size={40} color="#00AEEF" />
              <AppText style={{ marginTop: 8 }}>Hacé clic para abrir en Maps</AppText>
              <TouchableOpacity onPress={openInMaps} style={styles.openMapsBtn}>
                <AppText style={{ color: "#fff" }}>Abrir en Maps</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mapFallback}>
              <AppText>No hay coordenadas disponibles</AppText>
            </View>
          )}
        </View>

        {/* BOTÓN RESERVAR (debajo del mapa) */}
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity style={styles.reserveFullBtn} onPress={() => {/* lógica reservar */}}>
            <AppText variant="semibold" style={styles.reserveFullBtnText}>Reservar</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* Helpers */

function renderStars(rating: number | undefined) {
  const stars = [];
  const r = Math.round((rating ?? 0) * 2) / 2; // round to .5
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(r)) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    } else if (i - 0.5 === r) {
      stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
    }
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
}

function serviceItemsFromCourt(court: any) {
  const tipo = court.tipo ?? "Indoor";
  return [
    { key: "surface", label: "césped sintético", icon: <MaterialCommunityIcons name="grass" size={20} color="#00AEEF" /> },
    { key: "led", label: "led", icon: <Ionicons name="bulb-outline" size={18} color="#666" /> },
    { key: "indoor", label: tipo.toLowerCase() === "indoor" ? "indoor" : "outdoor", icon: <Ionicons name={tipo.toLowerCase() === "indoor" ? "home-outline" : "sunny-outline"} size={18} color="#00AEEF" /> },
    { key: "locker", label: "vestuario", icon: <Ionicons name="shirt-outline" size={18} color="#666" /> },
    { key: "rent", label: "alquiler", icon: <Ionicons name="cart-outline" size={18} color="#666" /> },
    { key: "bar", label: "bar", icon: <Ionicons name="beer-outline" size={18} color="#666" /> },
    { key: "parking", label: "estacionamiento", icon: <Ionicons name="car-outline" size={18} color="#666" /> },
  ];
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { height: HEADER_HEIGHT, width: "100%" },
  headerImage: { width: "100%", height: HEADER_HEIGHT, position: "absolute", top: 0, left: 0, right: 0 },
  headerNoImage: { backgroundColor: "#444", justifyContent: "center", alignItems: "center" },
  gradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: 150 },
  backBtn: { position: "absolute", left: 12, top: 44, backgroundColor: "rgba(0,0,0,0.35)", padding: 8, borderRadius: 20 },
  headerContent: { position: "absolute", left: 16, right: 16, bottom: 18 },
  title: { fontSize: 24, color: "#fff", textAlign: "center", marginBottom: 8 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaLeft: { flexDirection: "row", alignItems: "center" },
  locationText: { marginLeft: 6, color: "#fff" },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingNumber: { marginLeft: 8, color: "#fff", fontWeight: "600" },
  reviews: { color: "#fff", marginLeft: 4 },
  body: { flex: 1, paddingTop: 16 },
  description: { paddingHorizontal: 16, fontSize: 15, color: "#333", marginBottom: 16 },
  carouselWrap: { marginBottom: 18 },
  carouselCard: {
    width: width * 0.8,
    height: 150,
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
    elevation: 2,
  },
  carouselImage: { width: "100%", height: "100%" },
  sectionTitle: { paddingHorizontal: 16, fontSize: 18, marginBottom: 12 },
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16 },
  serviceItem: { width: "33%", alignItems: "center", marginBottom: 18 },
  serviceIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 6, backgroundColor: "#F6F8FA" },
  serviceLabel: { fontSize: 12, color: "#555", textAlign: "center" },
  map: { width: "100%", height: 220, borderRadius: 12, overflow: "hidden" },
  mapFallback: { height: 220, borderRadius: 12, backgroundColor: "#F6F8FA", justifyContent: "center", alignItems: "center" },
  openMapsBtn: { marginTop: 10, backgroundColor: "#00AEEF", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  reserveFullBtn: { backgroundColor: "#00AEEF", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginBottom: 24 },
  reserveFullBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  goBackBtn: { marginTop: 16, backgroundColor: "#00AEEF", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }
});
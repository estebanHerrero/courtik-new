import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import AppText from "../components/AppText";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get('window');

// Datos de ejemplo (fallback)
const canchasFallback = [
  {
    id: 1,
    nombre: "World Padel Center CABA",
    direccion: "Dr. Luis Beláustegui 3041",
    precio: 20000,
    tipo: "Indoor",
    imagen: require("../assets/court1.jpg")
  },
  {
    id: 2,
    nombre: "Lasaigues Padel Sheraton",
    direccion: "Dr. Luis Beláustegui 3041",
    precio: 1800,
    tipo: "Outdoor",
    imagen: require("../assets/court2.jpg")
  },
  {
    id: 3,
    nombre: "Padel Club Station",
    direccion: "Dr. Luis Beláustegui 3041",
    precio: 3200,
    tipo: "Indoor",
  },
  {
    id: 4,
    nombre: "Quality Padel Club",
    direccion: "Dr. Luis Beláustegui 3041",
    precio: 2000,
    tipo: "Outdoor",
    imagen: require("../assets/court4.jpg")
  }
];

export default function HomeScreen() {
  const router = useRouter();

  // Estados del formulario
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [indoor, setIndoor] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDateFocused, setDateFocused] = useState(false);
  const [isHourFocused, setHourFocused] = useState(false);

  // Data desde Supabase (inicializo con fallback)
  const [canchas, setCanchas] = useState<any[]>(canchasFallback);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("courts")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          // mantenemos el fallback en caso de error
        } else if (data && Array.isArray(data) && data.length > 0) {
          // Ajuste: supabase devuelve images como text[] (URLs). adaptamos la estructura si hace falta.
          setCanchas(data);
        }
      } catch (err) {
        console.error("Error cargando canchas:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const renderCanchaCard = ({ item }) => {
    // Determinar la imagen: si hay item.images (array de URLs) usamos la primera; si item.imagen es string o require
    const imgSource =
      item?.images && Array.isArray(item.images) && item.images.length
        ? { uri: item.images[0] }
        : (typeof item.imagen === "string"
            ? { uri: item.imagen }
            : item.imagen);

    return (
      <View style={styles.card}>
        <Image source={imgSource} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <AppText variant="semibold" style={styles.cardTitle}>
            {item.nombre}
          </AppText>

          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <AppText variant="regular" style={{ fontSize: 13, flexShrink: 1 }}>
              {item.direccion}
            </AppText>

            <TouchableOpacity
              onPress={() => router.push(`/infocourt/${item.id}`)}
              style={{ marginLeft: 6 }}
              accessibilityLabel={`Más información sobre ${item.nombre}`}
            >
              <Ionicons name="information-circle-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            <AppText style={styles.cardPrice}>
              ${item.precio}/hora
            </AppText>
            <View style={styles.typeContainer}>
              <Ionicons
                name={item.tipo === "Indoor" ? "home-outline" : "sunny-outline"}
                size={16}
                color={item.tipo === "Indoor" ? "#00AEEF" : "#FF9800"}
              />
              <AppText style={[
                styles.cardType,
                { color: item.tipo === "Indoor" ? "#00AEEF" : "#FF9800" }
              ]}>
                {item.tipo}
              </AppText>
            </View>
          </View>

          <TouchableOpacity style={styles.reserveBtn}>
            <AppText variant="semibold" style={styles.reserveBtnText}>
              Reservar
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <Ionicons name="person-circle-outline" size={30} color="#0B0F14" style={{ marginRight: 12 }} />
          <Ionicons name="menu" size={28} color="#0B0F14" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FORM */}
        <View style={styles.form}>
          {/* Input Fecha */}
          <TouchableOpacity
            style={[
              styles.inputWrapper,
              { borderColor: isDateFocused ? "#00AEEF" : "#7B94A4" }
            ]}
            onPress={() => setShowDatePicker(true)}
            onFocus={() => setDateFocused(true)}
            onBlur={() => setDateFocused(false)}
          >
            <AppText style={{ flex: 1, fontSize: 16, color: date ? "#333" : "#555" }}>
              {date || "¿Qué día querés jugar?"}
            </AppText>
            <Ionicons name="calendar-outline" size={20} color="#00AEEF" style={styles.inputIcon} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate.toLocaleDateString());
              }}
            />
          )}

          {/* Input Hora */}
          <TouchableOpacity
            style={[
              styles.inputWrapper,
              { borderColor: isHourFocused ? "#00AEEF" : "#7B94A4" }
            ]}
            onPress={() => setShowTimePicker(true)}
            onFocus={() => setHourFocused(true)}
            onBlur={() => setHourFocused(false)}
          >
            <AppText style={{ flex: 1, fontSize: 16, color: hour ? "#333" : "#555" }}>
              {hour || "¿A qué hora?"}
            </AppText>
            <Ionicons name="time-outline" size={20} color="#00AEEF" style={styles.inputIcon} />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const h = selectedTime.getHours().toString().padStart(2, "0");
                  const m = selectedTime.getMinutes().toString().padStart(2, "0");
                  setHour(`${h}:${m}`);
                }
              }}
            />
          )}

          {/* Toggle Indoor/Outdoor */}
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[styles.toggleBtn, indoor && styles.toggleBtnActive]}
              onPress={() => setIndoor(true)}
            >
              <AppText style={indoor ? styles.toggleTextActive : styles.toggleText}>Indoor</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, !indoor && styles.toggleBtnActive]}
              onPress={() => setIndoor(false)}
            >
              <AppText style={!indoor ? styles.toggleTextActive : styles.toggleText}>Outdoor</AppText>
            </TouchableOpacity>
          </View>

          {/* Botón Buscar */}
          <TouchableOpacity style={styles.searchBtn}>
            <AppText variant="semibold" style={styles.searchBtnText}>
              Buscar
            </AppText>
          </TouchableOpacity>
        </View>

        {/* CAROUSEL DE CANCHAS */}
        <View style={styles.resultsSection}>
          <AppText variant="semibold" style={styles.sectionTitle}>
            Canchas Disponibles
          </AppText>

          {loading ? (
            <ActivityIndicator style={{ marginVertical: 40 }} />
          ) : (
            <FlatList
              data={canchas}
              renderItem={renderCanchaCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
              snapToInterval={width * 0.8 + 16}
              decelerationRate="fast"
            />
          )}
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={28} color="#00AEEF" />
        <Ionicons name="tennisball-outline" size={28} color="#888" />
        <Ionicons name="person-outline" size={28} color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 60 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logo: { width: 120, height: 60, marginBottom: 8 },
  headerRight: { flexDirection: "row", alignItems: "center" },

  form: { marginBottom: 20 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#fff"
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222222",
    paddingVertical: 10
  },
  inputIcon: { marginLeft: 8 },

  switchWrapper: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  switchLabel: { marginLeft: 8, fontSize: 14, color: "#222222" },

  searchBtn: { backgroundColor: "#00AEEF", paddingVertical: 10, alignItems: "center", borderRadius: 25, elevation: 3 },
  searchBtnText: { color: "#fff", fontSize: 18, letterSpacing: 1 },

  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderColor: "#eee", marginTop: "auto" },

  toggleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 26,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#00AEEF",
    width: "50%",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  toggleBtnActive: {
    backgroundColor: "#00AEEF"
  },
  toggleText: {
    color: "#00AEEF",
    fontSize: 14,
  },
  toggleTextActive: {
    color: "#fff",
    fontSize: 14,
  },

  // Estilos del carousel
  resultsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#0B0F14",
  },
  carouselContainer: {
    paddingLeft: 0,
  },
  card: {
    width: width * 0.6,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#7B94A4",
    borderWidth: 1,
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: "#0B0F14",
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardPrice: {
    fontSize: 18,
    color: "#00AEEF",
    fontWeight: "600",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardType: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  reserveBtn: {
    backgroundColor: "#00AEEF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  reserveBtnText: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 1,
  },
});
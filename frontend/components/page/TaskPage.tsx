import { useEffect, useState } from "react";
import apiClient from "../service/api";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface TaskProp {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get("/task/api/tasks/json");
      setTasks(response.data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de récupérer les taches");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      const response = await apiClient.get("/task/api/tasks/csv", {
        responseType: "blob",
      });
      if (Platform.OS === "web") {
        // Téléchargement pour pc
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "tasks.csv";
        link.click();
        window.URL.revokeObjectURL(url);
        window.alert("Csv téléchargé avec succés");
      } else {
        // Téléchargement pour la version mobile (ne fonctionne pas pour le moment)
        const dir = FileSystem.Paths.document;
        const fileUri = `${dir}tasks.csv`;

        const csvContent = await new Response(response.data).text();
        await FileSystem.writeAsStringAsync(fileUri, csvContent);

        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de télécherger le csv");
    }
  };

  const handleTask = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/task/new", {
        title,
        description,
      });
      if (Platform.OS === "web") {
        window.alert("Tache créée avec succès");
        fetchTasks();
      } else {
        Alert.alert("Succès", "Tache créée avec succès");
        fetchTasks();
      }
    } catch (error) {
      console.error(error, "Erreur lors de la création de la tache");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <Text>Chargement...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>📋 Mes Tâches Médicales</Text>

          {/* Bouton CSV */}
          <TouchableOpacity onPress={downloadCsv} style={styles.btnPrimary}>
            <Text style={styles.btnTextPrimary}>📥 Exporter CSV</Text>
          </TouchableOpacity>

          {/* Formulaire Ajout */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>➕ Nouvelle Tâche</Text>

            <TextInput
              style={styles.input}
              placeholder="Titre de la tâche"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Description"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              onPress={handleTask}
              style={[styles.btnPrimary, styles.btnFullWidth]}
              disabled={loading}
            >
              <Text style={styles.btnTextPrimary}>
                {loading ? "⏳ Création..." : "✅ Ajouter Tâche"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Liste */}
          <Text style={styles.sectionTitle}>
            📝 {tasks.length} tâche{tasks.length > 1 ? "s" : ""}
          </Text>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskDate}>
                  🗓️{" "}
                  {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },

  // Boutons
  btnPrimary: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnTextPrimary: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  btnFullWidth: {
    marginTop: 12,
  },

  // Formulaire
  formCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // Liste
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 8,
  },
  taskDate: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
});

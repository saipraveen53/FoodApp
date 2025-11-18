import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// Ee line correct ga install ayyi undali: npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGE_BASE_URL, rootApi } from './axiosInstance';
import NavBar from './components/NavBar';
import { useAuth } from './FoodContext';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  menuCategory: {
    id: number;
    name: string;
  } | null;
}

interface SelectedImage {
    uri: string;
    name: string;
    type: string;
}

interface ItemForm {
  id: number | null;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  categoryId: string;
}

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && screenWidth > 768;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    padding: isDesktop ? 40 : 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: isDesktop ? 0 : 20,
  },
  title: {
    fontSize: isDesktop ? 36 : 28,
    fontWeight: 'bold',
    color: '#FF8A00',
  },
  addItemButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  addItemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#e0e0e0',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: isDesktop ? 'row' : 'column',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: isDesktop ? 120 : '100%',
    height: isDesktop ? 120 : 180,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 13,
    color: '#ccc',
    marginVertical: 4,
  },
  category: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 18,
    color: '#FF8A00',
    fontWeight: '900',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  actionText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 25,
    width: isDesktop ? 500 : '90%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3a3a3a',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
  inputDesc: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#FF8A00',
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: '#555',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
  },
  imagePickerButton: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8A00',
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover',
  },
  imageFileName: {
    color: '#ccc',
    fontSize: 12,
    padding: 8,
  }
});

const ItemCardAdmin = ({ item, onEdit, onDelete }) => {
  const imageUrl = item.imageUrl?.startsWith('http')
    ? item.imageUrl
    : `${IMAGE_BASE_URL}/images/${item.imageUrl}`;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.textContainer}>
        <View>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.category}>Category: {item.menuCategory?.name || 'ID: ' + item.menuCategory?.id || 'Uncategorized'}</Text>
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};


const AdminDashboard = () => {
  const router = useRouter();
  const { isAuthenticated, userRole, isCheckingAuth } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const [modalForm, setModalForm] = useState<ItemForm>({
    id: null,
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    categoryId: '',
  });

  const isAdmin = userRole === 'ROLE_ADMIN';

  // --- IMAGE PICKER HANDLER ---
  const pickImage = async () => {
    try {
      const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

      if (isMobile) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'We need camera roll permissions to select an image!');
          return;
        }
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const filename = uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = result.assets[0].mimeType || (match ? `image/${match[1]}` : 'image/jpeg');
        
        setSelectedImage({ uri, name: filename, type });
        setModalForm(prev => ({ ...prev, imageUrl: uri })); 
      }
    } catch (e) {
      console.error('Image Picker Error:', e);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };
  
  // --- EXISTING API HANDLERS ---
  
  const fetchItems = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
        setError(null);
      }
      const response = await rootApi.get('items/allItems');
      setItems(response.data);
    } catch (error) {
      setError('Failed to load menu items. Check server connection.');
      console.error('Fetch Items Error:', error);
    } finally {
      if (!isRefreshing) {
        setLoading(false);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems(true);
    setRefreshing(false);
  }, []);

  const handleOpenAddModal = () => {
    setModalForm({
      id: null,
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      categoryId: '',
    });
    setSelectedImage(null); // Reset image state
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setModalForm({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      imageUrl: item.imageUrl || '',
      categoryId: item.menuCategory?.id?.toString() || '',
    });
    setSelectedImage(null); // Reset image state for edit
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!modalForm.name || !modalForm.price || !modalForm.categoryId || !modalForm.description) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Price, Description, Category ID).');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const price = parseFloat(modalForm.price);
      if (isNaN(price) || price <= 0) {
        Alert.alert('Error', 'Please enter a valid price.');
        setIsSubmitting(false);
        return;
      }
      
      let endpoint = '';

      if (modalForm.id) {
        // --- EDIT EXISTING ITEM (PUT) ---
        const categoryId = modalForm.categoryId;
        const baseURL = `items/updateItem/${modalForm.id}/${categoryId}`;
        
        const params = new URLSearchParams();
        params.append('name', modalForm.name);
        params.append('price', price.toString());
        params.append('description', modalForm.description);

        let requestBody: FormData | {} = {};
        let headers: any = {};
        
        if (selectedImage) {
            requestBody = new FormData();
            // CHANGE: Using 'imageFile' as key for file upload
            requestBody.append('imageFile', selectedImage as any); 
            headers = { 'Content-Type': 'multipart/form-data' };

        } else if (modalForm.imageUrl) {
            params.append('imageUrl', modalForm.imageUrl);
        }

        const fullUrl = `${baseURL}?${params.toString()}`;
        
        await rootApi.put(fullUrl, requestBody, { headers });
        
        Alert.alert('Success', `${modalForm.name} updated successfully!`);

      } else {
        // --- ADD NEW ITEM (POST with Query Params & FormData) ---
        const categoryId = modalForm.categoryId;
        const baseURL = `items/addItem/${categoryId}`; // Base path for rootApi
        
        const params = new URLSearchParams();
        params.append('name', modalForm.name);
        params.append('price', price.toString());
        params.append('description', modalForm.description);
        
        let fullUrl = `${baseURL}?${params.toString()}`;
        let requestBody: FormData | {} = {};
        let headers: any = {};
        
        if (selectedImage) {
            requestBody = new FormData();
            // CHANGE: Using 'imageFile' as key for file upload
            requestBody.append('imageFile', selectedImage as any); 
            headers = { 'Content-Type': 'multipart/form-data' };
            
        } else if (modalForm.imageUrl) {
            fullUrl += `&imageUrl=${encodeURIComponent(modalForm.imageUrl)}`;
            requestBody = {};
        }

        await rootApi.post(fullUrl, requestBody, { headers });
        
        Alert.alert('Success', `${modalForm.name} added successfully!`);
      }

      setIsModalVisible(false);
      onRefresh(); 
    } catch (error) {
      console.error('Failed to submit item:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to submit item: ${modalForm.id ? 'Update' : 'Add'} failed. Server said: ${error.response?.data?.message || error.message}.`);
    } finally {
      setIsSubmitting(false);
      setSelectedImage(null); // Clear selected image
    }
  };
  
  const handleDelete = (itemId: number) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete item #${itemId}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(itemId) },
      ]
    );
  };

  const confirmDelete = async (itemId: number) => {
    try {
      await rootApi.delete(`items/deleteItem/${itemId}`); 
      Alert.alert('Success', `Item #${itemId} deleted successfully.`);
      onRefresh();
    } catch (error) {
      console.error('Delete Item Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete item. Check server status.');
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchItems();
    }
  }, [isAuthenticated, isAdmin]);
  
  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isAuthenticated) {
        router.replace('FoodApp/Login');
        return;
    }
    if (!isAdmin) {
        Alert.alert('Unauthorized', 'You do not have administrative privileges.');
        router.replace('/');
    }
  }, [isAuthenticated, isAdmin, isCheckingAuth, router]);
  
  
  if (isCheckingAuth) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <NavBar activeScreen='Admin' />
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF8A00" />
                <Text style={styles.loadingText}>Verifying permissions...</Text>
            </View>
        </SafeAreaView>
    );
  }
  
  if (!isAuthenticated || !isAdmin) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <NavBar activeScreen='Admin' />
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF8A00" />
                <Text style={styles.loadingText}>Redirecting to Login...</Text>
            </View>
        </SafeAreaView>
    );
  }
  
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <NavBar activeScreen='Admin' />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF8A00" />
          <Text style={styles.loadingText}>Loading Admin Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <NavBar activeScreen='Admin' />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.addItemButton} onPress={onRefresh}>
            <Text style={styles.addItemButtonText}>Retry Fetch</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <NavBar activeScreen='Admin' />

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Product Supervision</Text>
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={handleOpenAddModal}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>+</Text>
            <Text style={styles.addItemButtonText}>Add New Item</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ItemCardAdmin 
              item={item} 
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#FF8A00" 
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>No menu items found.</Text>
            </View>
          )}
        />
      </View>
      
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsModalVisible(false)}
        >
          <View 
            style={styles.modalContainer}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {modalForm.id ? 'Edit Menu Item' : 'Add New Menu Item'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                placeholderTextColor="#888"
                value={modalForm.name}
                onChangeText={text => setModalForm(prev => ({ ...prev, name: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                placeholderTextColor="#888"
                value={modalForm.price}
                onChangeText={text => setModalForm(prev => ({ ...prev, price: text }))}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.inputDesc]}
                placeholder="Description"
                placeholderTextColor="#888"
                value={modalForm.description}
                onChangeText={text => setModalForm(prev => ({ ...prev, description: text }))}
                multiline={true}
                numberOfLines={4}
              />
              
              {/* Image Picker Implementation */}
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity 
                    style={styles.imagePickerButton} 
                    onPress={pickImage}
                    disabled={isSubmitting}
                >
                    <Text style={styles.imagePickerText}>
                        {selectedImage ? 'Change Image' : 'Pick Image from Library'}
                    </Text>
                </TouchableOpacity>
                {selectedImage ? (
                    <>
                      <Image 
                          source={{ uri: selectedImage.uri }} 
                          style={styles.imagePreview} 
                      />
                      <Text style={styles.imageFileName}>File: {selectedImage.name}</Text>
                    </>
                ) : modalForm.id && modalForm.imageUrl ? (
                    <>
                        <Text style={styles.imageFileName}>Current URL: {modalForm.imageUrl}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Image URL or filename (Optional)"
                            placeholderTextColor="#888"
                            value={modalForm.imageUrl}
                            onChangeText={text => setModalForm(prev => ({ ...prev, imageUrl: text }))}
                        />
                    </>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="Image URL (Optional fallback)"
                        placeholderTextColor="#888"
                        value={modalForm.imageUrl}
                        onChangeText={text => setModalForm(prev => ({ ...prev, imageUrl: text }))}
                    />
                )}
              </View>
              {/* END Image Picker */}
              
              <TextInput
                style={styles.input}
                placeholder="Category ID (e.g., 1, 2, 3)"
                placeholderTextColor="#888"
                value={modalForm.categoryId}
                onChangeText={text => setModalForm(prev => ({ ...prev, categoryId: text }))}
                keyboardType="numeric"
              />
              
              <View style={styles.modalButtonRow}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.modalButtonText}>
                      {modalForm.id ? 'Update Item' : 'Add Item'}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setIsModalVisible(false)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminDashboard;
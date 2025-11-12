import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const FOOD_SLIDES = [
    {
        title: 'GRILLED CHICKEN',
        subtitle: 'THE CHICKEN EXPERTS',
        description: 'Experience the best-in-class flavor with our signature grilled chicken. Juicy, tender, and perfectly seasoned.',
        imageUri: 'https://i.ibb.co/PzDDSKf0/old-wall-red-brick-wall-antique-texture-dark-brown-and-red-brick-wall-backgorund-image-photo.webp',
        productImage: require('@/assets/images/chicken1.png'),
        specialColor: '#FFD700',
    },
    {
        title: 'VIBE SHAKES',
        subtitle: 'COOL. CREAMY. CRAVABLE.',
        description: 'Sip on happiness! Our shakes blend premium flavors and creamy texture for the ultimate chill experience.',
        imageUri: 'https://i.ibb.co/PzDDSKf0/old-wall-red-brick-wall-antique-texture-dark-brown-and-red-brick-wall-backgorund-image-photo.webp',
        productImage: require('@/assets/images/shake.png'),
        specialColor: '#FF4500',
    },
    {
        title: 'VEGGIE BURGER',
        subtitle: 'HEALTHY CHOICE',
        description: 'A gourmet vegetarian option, packed with fresh vegetables and homemade sauce.',
        imageUri: 'https://i.ibb.co/PzDDSKf0/old-wall-red-brick-wall-antique-texture-dark-brown-and-red-brick-wall-backgorund-image-photo.webp',
        productImage: require('@/assets/images/burg.png'),
        specialColor: '#3CB371',
    },
];

const SlideContent = ({ slide }) => (
    <ImageBackground
        source={{ uri: slide.imageUri }}
        style={styles.header} 
        imageStyle={styles.backgroundImage}>

        <View style={styles.overlay} />

        <View style={styles.contentBox}>
            <Text style={[styles.special, { color: slide.specialColor }]}>
                {slide.subtitle}
            </Text>
            <Text style={styles.delicious}>DELICIOUS</Text>
            <Text style={styles.grilled}>{slide.title}</Text>

           {slide.title !== 'VIBE SHAKES' && (
                <Text style={styles.subHeading}>FRESHLY COOKED & SMOKED</Text>
            )}

            <Text style={styles.description}>
                {slide.description}
            </Text>

            {/* * We only render the button here for the web layout.
              * On mobile, it will be rendered AFTER the image.
              */}
            {Platform.OS === 'web' && (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.shopBtn}>
                        <Text style={styles.btnText}>ORDER NOW</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>

        <Image
            source={slide.productImage}
            style={styles.productImage} 
        />

        {/* * We render the button here ONLY for mobile (Platform.OS !== 'web').
          * This places it below the image in the vertical flow.
          */}
        {Platform.OS !== 'web' && (
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.shopBtn}>
                    <Text style={styles.btnText}>ORDER NOW</Text>
                </TouchableOpacity>
            </View>
        )}
    </ImageBackground>
);

const Slide = ({ slide }) => {
    return <SlideContent slide={slide} />;
};


export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.navLinks}>
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
          <Text style={styles.navText}>Gallery</Text>
          <Text style={styles.navText}>Shop</Text>
          <Text style={styles.navText}>Contact</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={Platform.OS === 'web' ? "Search for dishes..." : "Search..."}
            placeholderTextColor="#bbbbbb"
          />
        </View>

        <View style={styles.authLinks}>
          <TouchableOpacity>
            <Text style={styles.navText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Swiper 
          style={{}} 
          loop={true} 
          autoplay={true}
          autoplayTimeout={3}
          showsButtons={false} 
          showsPagination={true} 
          activeDotColor="#FF8A00" 
          dotColor="rgba(255, 255, 255, 0.5)"
          paginationStyle={{ bottom: 15 }} 
        >
          {FOOD_SLIDES.map((slide, index) => (
              <Slide key={index} slide={slide} />
          ))}
        </Swiper>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#1a1a1a',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#101010',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    ...Platform.select({
        web: { 
            paddingHorizontal: 25,
            paddingVertical: 18,
        },
        default: { 
            paddingHorizontal: 10,
            paddingVertical: 15,
        }
    })
  },
  navLinks: {
    flexDirection: 'row',
    ...Platform.select({
        web: { gap: 20, flex: 2 },
        default: { gap: 10, flex: 2 }
    })
  },
  navText: {
    color: '#e0e0e0',
    fontWeight: '500',
    ...Platform.select({
        web: { fontSize: 16, letterSpacing: 0.5 },
        default: { fontSize: 12 }
    })
  },
  navTextActive: {
    color: '#FF8A00',
    fontWeight: '700',
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#282828',
    color: 'white',
    borderRadius: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#444444',
    ...Platform.select({
        web: {
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        default: {
            paddingHorizontal: 15,
            paddingVertical: 8,
        }
    })
  },
  authLinks: {
    flexDirection: 'row',
    flex: 1.2,
    justifyContent: 'flex-end',
    ...Platform.select({
        web: { gap: 15 },
        default: { gap: 8 }
    })
  },
  header: {
    flex: 1, 
    position: 'relative',
    backgroundColor: '#0b3c4c', 
    ...Platform.select({
        web: { 
            justifyContent: 'center',
            paddingHorizontal: 60,
        },
        default: { 
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 20,
        }
    })
  },
  backgroundImage: {
    objectFit: 'cover',
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentBox: {
    zIndex: 10,
    ...Platform.select({
        web: { 
            width: '50%',
            alignItems: 'flex-start',
        },
        default: { 
            width: '100%',
            alignItems: 'center',
        }
    })
  },
  special: {
    fontWeight: '800',
    marginBottom: 5,
    letterSpacing: 2,
    ...Platform.select({
        web: { fontSize: 18 },
        default: { fontSize: 16 }
    })
  },
  delicious: {
    color: 'white',
    fontWeight: '900',
    marginBottom: 0,
    letterSpacing: 1,
    ...Platform.select({
        web: { fontSize: 40 },
        default: { fontSize: 30 }
    })
  },
  grilled: {
    color: 'white',
    fontWeight: '900',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    ...Platform.select({
        web: { 
            fontSize: 60, 
            marginBottom: 30,
            textAlign: 'left'
        },
        default: { 
            fontSize: 48, 
            marginBottom: 20,
            textAlign: 'center'
        }
    })
  },
  subHeading: {
    color: '#FF8A00',
    fontWeight: '700',
    marginBottom: 15,
    letterSpacing: 1,
    ...Platform.select({
        web: { fontSize: 20, textAlign: 'left' },
        default: { fontSize: 18, textAlign: 'center' }
    })
  },
  description: {
    color: '#f0f0f0',
    width: '90%',
    ...Platform.select({
        web: {
            fontSize: 16,
            marginBottom: 40,
            lineHeight: 24,
            textAlign: 'left',
        },
        default: {
            fontSize: 15,
            marginBottom: 30,
            lineHeight: 22,
            textAlign: 'center',
        }
    })
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  shopBtn: {
    backgroundColor: '#FF8A00',
    borderRadius: 8,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 10,
    ...Platform.select({
        web: {
            paddingVertical: 16,
            paddingHorizontal: 35,
        },
        default: {
            paddingVertical: 14,
            paddingHorizontal: 30,
        }
    })
  },
  btnText: {
    color: 'white',
    fontWeight: '800',
    letterSpacing: 1,
    ...Platform.select({
        web: { fontSize: 18 },
        default: { fontSize: 16 }
    })
  },
  productImage: {
    ...Platform.select({
        web: { 
            position: 'absolute',
            width: 450,
            height: 450,
            resizeMode: 'contain',
            pointerEvents: 'none',
            zIndex: 5,
            top: '55%',
            left: '60%',
            transform: [
                { translateY: -225 },
                { translateX: -100 }
            ],
        },
        default: { 
            width: '90%',
            height: 250,
            resizeMode: 'contain',
            zIndex: 5,
            marginTop: 20,
        }
    })
  },
});
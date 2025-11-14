import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import NavBar from '../components/NavBar';

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

const SlideContent = ({ slide, onOrderPress }) => (
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

            {Platform.OS === 'web' && (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.shopBtn} onPress={onOrderPress}>
                        <Text style={styles.btnText}>ORDER NOW</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>

        <Image
            source={slide.productImage}
            style={styles.productImage} 
        />

        {Platform.OS !== 'web' && (
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.shopBtn} onPress={onOrderPress}>
                    <Text style={styles.btnText}>ORDER NOW</Text>
                </TouchableOpacity>
            </View>
        )}
    </ImageBackground>
);

const Slide = ({ slide, onOrderPress }) => {
    return <SlideContent slide={slide} onOrderPress={onOrderPress} />;
};


export default function HomePage() {
  const router = useRouter();

  const handleOrderPress = () => {
    router.push('/FoodApp/AllItems');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <NavBar activeScreen='Home' />

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
              <Slide 
                  key={index} 
                  slide={slide} 
                  onOrderPress={handleOrderPress} 
              />
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
        default: { fontSize: 18, textAlign: "center" }
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
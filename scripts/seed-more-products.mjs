import mongoose from 'mongoose'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alirehman70612_db_user:RO1suNXa1mvTYnUN@cluster0.m8gmkq6.mongodb.net/test'

// Seller ID
const SELLER_ID = '691facda62456ca33ce76d00'

const products = [
  // Metalwork Category (6 products)
  {
    title: 'Brass Diya Lamp Set',
    description: 'Traditional brass diya lamps set of 6. Perfect for festivals and daily worship. Handcrafted with intricate designs.',
    price: 899,
    category: 'Metalwork',
    images: [
      'https://images.unsplash.com/photo-1605201979085-43d12a1c2c10?w=800',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800',
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800'
    ],
    stock: 25,
    isActive: true,
  },
  {
    title: 'Copper Water Bottle',
    description: 'Pure copper water bottle with Ayurvedic benefits. Leak-proof design with traditional engraving.',
    price: 1299,
    category: 'Metalwork',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
    ],
    stock: 30,
    isActive: true,
  },
  {
    title: 'Brass Temple Bell',
    description: 'Large brass temple bell with melodious sound. Hand-forged with traditional techniques.',
    price: 1599,
    category: 'Metalwork',
    images: [
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800',
      'https://images.unsplash.com/photo-1605201979085-43d12a1c2c10?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Silver Anklets Pair',
    description: 'Traditional silver anklets with ghungroo. Adjustable size with beautiful craftsmanship.',
    price: 2499,
    category: 'Metalwork',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Brass Peacock Showpiece',
    description: 'Decorative brass peacock statue. Intricate detailing perfect for home decor.',
    price: 1899,
    category: 'Metalwork',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800'
    ],
    stock: 12,
    isActive: true,
  },
  {
    title: 'Copper Pooja Thali Set',
    description: 'Complete copper pooja thali set with all essentials. Premium quality with designer patterns.',
    price: 2299,
    category: 'Metalwork',
    images: [
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800',
      'https://images.unsplash.com/photo-1605201979085-43d12a1c2c10?w=800'
    ],
    stock: 18,
    isActive: true,
  },

  // Home Decor Category (6 products)
  {
    title: 'Handpainted Decorative Plates',
    description: 'Set of 4 beautifully handpainted ceramic decorative plates. Vibrant colors and traditional motifs.',
    price: 1599,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Marble Inlay Coaster Set',
    description: 'Exquisite marble coasters with semi-precious stone inlay work. Set of 6 with holder.',
    price: 1799,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 25,
    isActive: true,
  },
  {
    title: 'Terracotta Wall Hanging',
    description: 'Traditional terracotta wall art depicting village life. Hand-painted in natural colors.',
    price: 999,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Bamboo Lamp Shade',
    description: 'Eco-friendly bamboo lamp shade with intricate weaving. Creates beautiful light patterns.',
    price: 1299,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 22,
    isActive: true,
  },
  {
    title: 'Brass Photo Frame Set',
    description: 'Vintage brass photo frames set of 3. Ornate designs perfect for family photos.',
    price: 1499,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800'
    ],
    stock: 18,
    isActive: true,
  },
  {
    title: 'Madhubani Wall Art',
    description: 'Authentic Madhubani painting on canvas. Traditional Bihar folk art with vibrant colors.',
    price: 2999,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800'
    ],
    stock: 10,
    isActive: true,
  },

  // Woodwork Category (6 products)
  {
    title: 'Wooden Wall Art Mandala',
    description: 'Stunning hand-carved wooden mandala wall art. Made from sustainable sheesham wood.',
    price: 4999,
    category: 'Woodwork',
    images: [
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 8,
    isActive: true,
  },
  {
    title: 'Carved Wooden Jewelry Box',
    description: 'Intricate carved jewelry box with velvet lining. Multiple compartments for organized storage.',
    price: 1899,
    category: 'Woodwork',
    images: [
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Wooden Serving Tray',
    description: 'Handcrafted wooden serving tray with brass handles. Perfect for entertaining guests.',
    price: 1299,
    category: 'Woodwork',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Rosewood Chess Board',
    description: 'Premium rosewood chess board with hand-carved pieces. Complete set in decorative box.',
    price: 5999,
    category: 'Woodwork',
    images: [
      'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800'
    ],
    stock: 6,
    isActive: true,
  },
  {
    title: 'Wooden Book Stand',
    description: 'Foldable wooden book stand with adjustable angles. Hand-carved floral patterns.',
    price: 899,
    category: 'Woodwork',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 25,
    isActive: true,
  },
  {
    title: 'Carved Wooden Mirror Frame',
    description: 'Ornate hand-carved mirror frame in traditional design. Solid wood with antique finish.',
    price: 3499,
    category: 'Woodwork',
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800'
    ],
    stock: 10,
    isActive: true,
  },

  // Jewelry Category (6 products)
  {
    title: 'Handcrafted Silver Jewelry Set',
    description: 'Exquisite silver jewelry set including necklace and earrings. Traditional craftsmanship with modern design.',
    price: 3499,
    category: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
    ],
    stock: 12,
    isActive: true,
  },
  {
    title: 'Kundan Meenakari Necklace',
    description: 'Traditional Kundan necklace with meenakari work. Perfect for weddings and special occasions.',
    price: 8999,
    category: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
    ],
    stock: 5,
    isActive: true,
  },
  {
    title: 'Oxidized Silver Bangles',
    description: 'Set of 4 oxidized silver bangles with tribal patterns. Adjustable size.',
    price: 1299,
    category: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Beaded Necklace Set',
    description: 'Colorful handmade beaded necklace with matching earrings. Bohemian style.',
    price: 799,
    category: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
    ],
    stock: 30,
    isActive: true,
  },
  {
    title: 'Temple Jewelry Earrings',
    description: 'Traditional South Indian temple jewelry earrings. Gold-plated with antique finish.',
    price: 1599,
    category: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1596944924591-4282a6e6f74e?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Pearl Pendant Necklace',
    description: 'Elegant freshwater pearl pendant on silver chain. Minimalist and versatile design.',
    price: 2299,
    category: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
    ],
    stock: 18,
    isActive: true,
  },

  // Pottery Category (6 products)
  {
    title: 'Ceramic Pottery Vase Set',
    description: 'Elegant set of 3 handcrafted ceramic vases. Unique glazing in earthy tones.',
    price: 1899,
    category: 'Pottery',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Terracotta Planters Set',
    description: 'Set of 5 terracotta planters in various sizes. Hand-painted with traditional motifs.',
    price: 999,
    category: 'Pottery',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800'
    ],
    stock: 25,
    isActive: true,
  },
  {
    title: 'Blue Pottery Bowls',
    description: 'Authentic Jaipur blue pottery bowls set of 4. Microwave and dishwasher safe.',
    price: 1599,
    category: 'Pottery',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handmade ceramic mugs with unique patterns. Perfect for gifting.',
    price: 1199,
    category: 'Pottery',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
    ],
    stock: 30,
    isActive: true,
  },
  {
    title: 'Clay Water Pot',
    description: 'Traditional clay water pot (Matka) for naturally cool water. Eco-friendly and healthy.',
    price: 699,
    category: 'Pottery',
    images: [
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'
    ],
    stock: 35,
    isActive: true,
  },
  {
    title: 'Ceramic Dinner Set',
    description: 'Complete handpainted ceramic dinner set for 4. Includes plates, bowls, and serving dishes.',
    price: 4999,
    category: 'Pottery',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 8,
    isActive: true,
  },

  // Textiles Category (8 products)
  {
    title: 'Handwoven Cotton Throw Blanket',
    description: 'Beautiful handwoven cotton throw blanket with traditional patterns. Soft and breathable.',
    price: 1899,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Silk Embroidered Cushion Covers',
    description: 'Set of 4 silk cushion covers with intricate hand embroidery. Vibrant colors and designs.',
    price: 2499,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Block Printed Bedsheet Set',
    description: 'Hand block printed bedsheet set with pillow covers. 100% cotton, double bed size.',
    price: 3299,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
    ],
    stock: 12,
    isActive: true,
  },
  {
    title: 'Pashmina Shawl',
    description: 'Authentic Kashmiri pashmina shawl with traditional embroidery. Luxuriously soft and warm.',
    price: 5999,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 8,
    isActive: true,
  },
  {
    title: 'Cotton Table Runner',
    description: 'Hand-loomed cotton table runner with tassels. Perfect for dining table decoration.',
    price: 899,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
    ],
    stock: 25,
    isActive: true,
  },
  {
    title: 'Embroidered Wall Tapestry',
    description: 'Large embroidered wall tapestry depicting traditional Indian scenes. Vibrant colors.',
    price: 4499,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 6,
    isActive: true,
  },
  {
    title: 'Handloom Cotton Saree',
    description: 'Traditional handloom cotton saree with zari border. Lightweight and comfortable.',
    price: 3999,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 10,
    isActive: true,
  },
  {
    title: 'Jute Shopping Bags Set',
    description: 'Eco-friendly jute shopping bags set of 3. Reusable and durable with printed designs.',
    price: 699,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'
    ],
    stock: 40,
    isActive: true,
  },

  // Paintings Category (8 products)
  {
    title: 'Warli Art Painting',
    description: 'Authentic Warli tribal art painting on canvas. Traditional Maharashtra folk art.',
    price: 2999,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
    ],
    stock: 12,
    isActive: true,
  },
  {
    title: 'Tanjore Painting',
    description: 'Traditional Tanjore painting with gold foil work. Depicts Hindu deities with intricate details.',
    price: 8999,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
    ],
    stock: 5,
    isActive: true,
  },
  {
    title: 'Miniature Rajasthani Painting',
    description: 'Exquisite miniature painting in Rajasthani style. Hand-painted with fine brushes.',
    price: 5499,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800'
    ],
    stock: 8,
    isActive: true,
  },
  {
    title: 'Kalamkari Art Print',
    description: 'Traditional Kalamkari block print on fabric. Natural dyes and ancient technique.',
    price: 1999,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Pattachitra Scroll Painting',
    description: 'Authentic Pattachitra scroll painting from Odisha. Depicts mythological stories.',
    price: 6999,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
    ],
    stock: 6,
    isActive: true,
  },
  {
    title: 'Contemporary Indian Art',
    description: 'Modern abstract painting by emerging Indian artist. Acrylic on canvas.',
    price: 4999,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800'
    ],
    stock: 10,
    isActive: true,
  },
  {
    title: 'Pichwai Painting',
    description: 'Traditional Pichwai painting from Rajasthan. Depicts Lord Krishna with vibrant colors.',
    price: 7499,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
    ],
    stock: 5,
    isActive: true,
  },
  {
    title: 'Gond Art Painting',
    description: 'Tribal Gond art painting from Madhya Pradesh. Nature-inspired with intricate patterns.',
    price: 3499,
    category: 'Paintings',
    images: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800'
    ],
    stock: 14,
    isActive: true,
  },

  // Handicrafts Category (8 products)
  {
    title: 'Bamboo Wind Chimes',
    description: 'Handcrafted bamboo wind chimes with melodious sound. Eco-friendly and decorative.',
    price: 799,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'
    ],
    stock: 25,
    isActive: true,
  },
  {
    title: 'Cane Basket Set',
    description: 'Handwoven cane baskets set of 3. Multi-purpose storage with traditional weaving technique.',
    price: 1299,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
    ],
    stock: 20,
    isActive: true,
  },
  {
    title: 'Papier Mache Box',
    description: 'Traditional Kashmiri papier mache box with hand-painted floral designs.',
    price: 1599,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800'
    ],
    stock: 15,
    isActive: true,
  },
  {
    title: 'Dhokra Metal Horse',
    description: 'Ancient Dhokra art metal horse sculpture. Tribal art from Central India.',
    price: 2999,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800',
      'https://images.unsplash.com/photo-1610017194778-3b8e8b5e8f5e?w=800'
    ],
    stock: 10,
    isActive: true,
  },
  {
    title: 'Chikankari Wall Hanging',
    description: 'Lucknow chikankari embroidered wall hanging. Traditional threadwork on cotton.',
    price: 1899,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 12,
    isActive: true,
  },
  {
    title: 'Marble Inlay Coaster Set',
    description: 'Agra marble coasters with semi-precious stone inlay. Set of 6 with holder.',
    price: 2499,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
    ],
    stock: 18,
    isActive: true,
  },
  {
    title: 'Bamboo Lamp Shade',
    description: 'Handwoven bamboo lamp shade creating beautiful light patterns. Sustainable and stylish.',
    price: 1499,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
      'https://images.unsplash.com/photo-1585933646126-523810768131?w=800'
    ],
    stock: 22,
    isActive: true,
  },
  {
    title: 'Shell Craft Mirror',
    description: 'Decorative mirror with intricate shell craft border. Unique coastal handicraft.',
    price: 1799,
    category: 'Handicrafts',
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800'
    ],
    stock: 14,
    isActive: true,
  },
]

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected successfully')

    const Product = mongoose.model('Product', new mongoose.Schema({
      title: String,
      description: String,
      price: Number,
      category: String,
      images: [String],
      stock: Number,
      sellerId: mongoose.Schema.Types.ObjectId,
      isActive: Boolean,
    }))

    // Clear existing products for this seller (optional)
    // await Product.deleteMany({ sellerId: SELLER_ID })
    // console.log('🗑️  Cleared existing products')

    // Insert all products
    const productsWithSeller = products.map(p => ({
      ...p,
      sellerId: SELLER_ID
    }))

    const result = await Product.insertMany(productsWithSeller)
    console.log(`✅ Successfully seeded ${result.length} products!`)
    
    // Log category counts
    const categories = {}
    result.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1
    })
    console.log('\n📊 Products by category:')
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`)
    })

    await mongoose.connection.close()
    console.log('\n✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()

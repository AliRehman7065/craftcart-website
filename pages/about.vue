<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold mb-6">About CraftCart</h1>
        <p class="text-xl text-orange-100 max-w-3xl mx-auto">
          Empowering Indian artisans by connecting them directly with customers worldwide
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p class="text-lg text-gray-600 mb-4">
              CraftCart is dedicated to preserving and promoting traditional Indian handicrafts by creating a direct marketplace between skilled artisans and customers who appreciate authentic, handmade products.
            </p>
            <p class="text-lg text-gray-600 mb-4">
              We believe that every handcrafted item tells a story of heritage, skill, and dedication. By eliminating middlemen, we ensure artisans receive fair compensation for their work while customers get authentic products at reasonable prices.
            </p>
            <p class="text-lg text-gray-600">
              Our platform supports sustainable livelihoods for artisan communities across India, helping preserve centuries-old craftsmanship traditions for future generations.
            </p>
          </div>
          <div class="bg-orange-100 rounded-lg p-8">
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                    🎨
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Authentic Craftsmanship</h3>
                  <p class="text-gray-600">Every product is handmade by verified artisans using traditional techniques</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                    🤝
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Fair Trade</h3>
                  <p class="text-gray-600">Direct connection ensures artisans receive fair prices for their work</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                    🌱
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Sustainable</h3>
                  <p class="text-gray-600">Supporting eco-friendly, handmade products over mass production</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-4">
            CraftCart was born from a simple observation: incredible artisans across India create beautiful, authentic handicrafts, but struggle to reach customers who would value their work. Meanwhile, customers seeking authentic handmade products often find it difficult to connect directly with artisans.
          </p>
          <p class="mb-4">
            We started CraftCart to bridge this gap. Our platform provides artisans with the tools and marketplace they need to showcase their crafts to a wider audience, while ensuring customers have access to genuine, handcrafted products with complete transparency about their origins.
          </p>
          <p>
            Today, we're proud to support hundreds of artisans across various craft traditions including pottery, metalwork, textiles, woodwork, and more. Every purchase on CraftCart directly supports an artisan's livelihood and helps preserve India's rich cultural heritage.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-orange-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold mb-2">500+</div>
            <div class="text-orange-100">Active Artisans</div>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">50,000+</div>
            <div class="text-orange-100">Products Sold</div>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">8</div>
            <div class="text-orange-100">Craft Categories</div>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">25+</div>
            <div class="text-orange-100">States Covered</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
        <p class="text-lg text-gray-600 mb-8">
          Whether you're an artisan looking to showcase your crafts or a customer seeking authentic handmade products, we'd love to have you join the CraftCart community.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/auth/register"
            class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            Become a Seller
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="px-8 py-4 bg-white hover:bg-gray-50 text-orange-600 font-semibold rounded-lg border-2 border-orange-600 transition-colors"
          >
            Browse Products
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About Us - CraftCart',
  description: 'Learn about CraftCart\'s mission to empower Indian artisans by connecting them directly with customers worldwide.',
})
</script>

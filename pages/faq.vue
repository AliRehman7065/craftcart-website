<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p class="text-xl text-orange-100">
          Find answers to common questions about CraftCart
        </p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Search -->
      <div class="mb-12">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for questions..."
          class="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedCategory === category
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-orange-50'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span class="font-semibold text-gray-900">{{ faq.question }}</span>
            <span class="text-orange-600 text-xl">{{ openFaqs.includes(index) ? '−' : '+' }}</span>
          </button>
          <div v-show="openFaqs.includes(index)" class="px-6 py-4 bg-gray-50 border-t">
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="mt-12 bg-orange-50 rounded-lg p-8 text-center border-2 border-orange-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
        <p class="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
        >
          Contact Support
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const selectedCategory = ref('All')
const openFaqs = ref<number[]>([])

const categories = ['All', 'General', 'Orders', 'Sellers', 'Shipping', 'Payments']

const faqs = [
  {
    category: 'General',
    question: 'What is CraftCart?',
    answer: 'CraftCart is an online marketplace that connects Indian artisans directly with customers. We help artisans showcase and sell their authentic handcrafted products while ensuring they receive fair compensation for their work.'
  },
  {
    category: 'General',
    question: 'Are all products handmade?',
    answer: 'Yes! Every product on CraftCart is handmade by verified artisans using traditional craftsmanship techniques. We ensure authenticity and quality through our artisan verification process.'
  },
  {
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or sign in, provide shipping details, and complete payment. You\'ll receive an order confirmation via email.'
  },
  {
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel your order before it\'s confirmed by the seller. Once confirmed, cancellations may not be possible. Contact the seller directly or reach out to our support team for assistance.'
  },
  {
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'After your order is shipped, you\'ll receive tracking information via email. You can also track your order status by visiting the "My Orders" section in your account dashboard.'
  },
  {
    category: 'Sellers',
    question: 'How do I become a seller on CraftCart?',
    answer: 'Click on "Become a Seller" and complete the registration form. You\'ll need to provide details about your craft, upload samples of your work, and verify your identity. Our team will review your application within 2-3 business days.'
  },
  {
    category: 'Sellers',
    question: 'What commission does CraftCart charge?',
    answer: 'CraftCart charges a small commission on each sale to maintain the platform. The exact percentage varies by category but ranges from 10-15%. We keep it low to ensure artisans receive fair compensation.'
  },
  {
    category: 'Sellers',
    question: 'How do I receive payments as a seller?',
    answer: 'Payments are processed directly to your bank account after the order is delivered and confirmed. You can track your earnings and payment history in your seller dashboard.'
  },
  {
    category: 'Shipping',
    question: 'What are the shipping charges?',
    answer: 'Shipping charges vary based on product size, weight, and delivery location. The exact shipping cost will be calculated at checkout before you complete your purchase.'
  },
  {
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 5-10 business days depending on your location and the seller\'s location. Some items may take longer as they are made-to-order. Estimated delivery time is shown on the product page.'
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship within India only. We\'re working on expanding to international shipping soon. Stay tuned for updates!'
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment gateway partners.'
  },
  {
    category: 'Payments',
    question: 'Is it safe to make payments on CraftCart?',
    answer: 'Yes, absolutely! All transactions are encrypted and processed through secure payment gateways. We never store your complete card details on our servers.'
  },
  {
    category: 'Payments',
    question: 'What is your refund policy?',
    answer: 'If you receive a damaged or incorrect product, you can request a refund within 7 days of delivery. Contact our support team with photos of the issue, and we\'ll process your refund after verification.'
  },
]

const filteredFaqs = computed(() => {
  let result = faqs

  // Filter by category
  if (selectedCategory.value !== 'All') {
    result = result.filter(faq => faq.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    )
  }

  return result
})

const toggleFaq = (index: number) => {
  const idx = openFaqs.value.indexOf(index)
  if (idx > -1) {
    openFaqs.value.splice(idx, 1)
  } else {
    openFaqs.value.push(index)
  }
}

useSeoMeta({
  title: 'FAQ - CraftCart',
  description: 'Find answers to frequently asked questions about CraftCart, orders, shipping, payments, and becoming a seller.',
})
</script>

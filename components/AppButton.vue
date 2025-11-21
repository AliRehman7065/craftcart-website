<script setup lang="ts">
interface Props {
  to?: string
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'primary' | 'white' | 'gray'
  size?: 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  type: 'button',
})

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none cursor-pointer'
  
  const sizes = {
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }
  
  const variants = {
    solid: {
      primary: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
      white: 'bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500',
      gray: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    },
    outline: {
      primary: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
      white: 'border-2 border-white text-white hover:bg-white/10 focus:ring-white',
      gray: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    },
    ghost: {
      primary: 'text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
      white: 'text-white hover:bg-white/10 focus:ring-white',
      gray: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    },
  }
  
  return `${base} ${sizes[props.size]} ${variants[props.variant][props.color]}`
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="buttonClasses"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>

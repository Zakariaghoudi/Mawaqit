import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // أضف -swc هنا

export default defineConfig({
  plugins: [react()],
})


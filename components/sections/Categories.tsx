import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  { name: 'Electronics', image: '/transparent-bg/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79-Photoroom.webp', slug: 'electronics', color: '#dfeffc' },
  { name: 'Fashion', image: '/transparent-bg/ed61305b-6a85-41ea-8a30-7751a1e92244.6b7780504e47e51afeccbd8f10a891e1-Photoroom.webp', slug: 'fashion', color: '#ffe5d8' },
  { name: 'Home', image: '/transparent-bg/21430531_en_front_800-Photoroom.webp', slug: 'home', color: '#eee5ff' },
  { name: 'Beauty', image: '/transparent-bg/2067c8ee-6f4a-4099-8f80-e5a84b988306.c483978f430cf4289faccbf6dd120434-Photoroom.webp', slug: 'beauty', color: '#e5f2c5' },
]

export function Categories() {
  return (
    <section className="bg-[#f4f4ef] py-14 sm:py-20">
      <div className="container-lumina">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#e64d25]">Start somewhere good</p><h2 className="mt-2 text-4xl font-black tracking-[-.045em] text-[#172a22] sm:text-5xl">Shop by department</h2></div>
          <Link href="/categories" className="hidden items-center gap-2 text-sm font-black text-[#172a22] sm:flex">See all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {categories.map((category, index) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`} className="group relative overflow-hidden rounded-[1.6rem] p-4 sm:p-6" style={{ backgroundColor: category.color }}>
              <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#172a22]/45">0{index + 1}</p><h3 className="mt-1 text-xl font-black tracking-tight text-[#172a22] sm:text-2xl">{category.name}</h3></div><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#172a22] transition group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span></div>
              <div className="relative mt-4 aspect-square"><Image src={category.image} alt={category.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-contain p-3 transition duration-500 group-hover:scale-110 group-hover:-rotate-2" /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

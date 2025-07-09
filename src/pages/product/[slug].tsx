import AxiosInstance from "@/helpers/axiosInstance"
import { ProductDataType } from "@/helpers/types"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { formatRupiah } from "@/helpers/number"

export default function ProductDetail() {
    const router = useRouter()

    const [productData, setProductData] = useState<ProductDataType>()

    useEffect(() => {
        if (router.query.slug) {
            AxiosInstance.get(`${process.env.API_URL}/api/product/${router.query.slug}`)
                .then((response) => setProductData(response.data))
                .catch((error) => console.error("Error fetching product data:", error))
        }
    }, [router.query.slug])

    return (
        <section className="px-12 md:px-24 pt-36 pb-12">
            <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-16">
                <div className="w-full md:w-1/2">
                    <img className="rounded-3xl" src={`${process.env.BASE_URL}/${productData?.cover_image}`} alt={`${productData?.name} Cover`} />
                </div>
                <div className="space-y-4 md:space-y-8 w-full md:w-1/2">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold">{productData?.name}</h1>
                        <h2 className="max-w-md w-full text-gray-700">{productData?.description}</h2>
                    </div>

                    {productData?.additional_price ? (
                        <p className="text-blue-500 font-semibold text-2xl">Rp{formatRupiah(productData?.price)}-{formatRupiah(productData?.additional_price)}K<span className="text-sm text-gray-500">{productData?.payment_type == 'subscription' ? '/month' : ''}</span></p>
                    ) : (
                        <p className="text-blue-500 font-semibold text-2xl">Rp{formatRupiah(productData?.price ?? 0)}K<span className="text-sm text-gray-500">{productData?.payment_type == 'subscription' ? '/month' : ''}</span></p>
                    )}

                    <div>
                        <p className="text-lg font-medium">Features</p>
                        <ul>
                            {productData?.product_features?.map((feature) => (
                                <li key={feature.id} className="text-gray-700">
                                    {feature.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section >
    )
}
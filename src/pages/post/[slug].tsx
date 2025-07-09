import AxiosInstance from "@/helpers/axiosInstance"
import { PostDataType } from "@/helpers/types"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { formatDate } from "@/helpers/date"
import { Link } from "@/components/icons/outline"

export default function PostDetail() {
    const router = useRouter()

    const [postData, setPostData] = useState<PostDataType>()

    useEffect(() => {
        if (router.query.slug) {
            AxiosInstance.get(`${process.env.API_URL}/api/post/${router.query.slug}`)
                .then((response) => setPostData(response.data))
                .catch((error) => console.error("Error fetching post data:", error))
        }
    }, [router.query.slug])

    const copyCurrentUrl = () => {
        navigator.clipboard.writeText(window.location.toString())
    }

    return (
        <section className="px-12 md:px-24 pt-36 pb-12">
            <div className="space-y-16">
                <div className="space-y-4 md:space-y-8 w-full md:w-1/2">
                    <div className="space-y-2">
                        <p className="text-gray-500 font-medium">{postData ? formatDate(postData.created_at) : ""}</p>
                        <h1 className="bg-clip-text bg-gradient-to-br from-blue-500 to-blue-300 text-transparent text-3xl font-semibold">{postData?.title}</h1>
                        <h2 className="max-w-md w-full text-gray-700">{postData?.description}</h2>
                    </div>
                </div>

                <div className="flex md:flex-row flex-col justify-between space-y-8 md:space-y-0 md:gap-16">
                    <div className="space-y-4 w-full md:w-2/3">
                        <p className="text-justify">
                            Dalam era digital yang terus berkembang, kebutuhan akan sistem yang cepat, efisien, dan terintegrasi menjadi hal yang sangat penting. Zan Micro System hadir sebagai solusi teknologi modern yang dirancang untuk membantu bisnis dalam mengelola berbagai aspek operasional secara lebih optimal.
                        </p>
                        <p className="text-justify">
                            Zan Micro System tidak hanya berfokus pada penyediaan layanan, tetapi juga pada pengalaman pengguna (user experience) yang intuitif dan mudah digunakan. Mulai dari tampilan halaman depan, katalog produk, hingga formulir kontak, setiap elemen dirancang untuk memastikan kenyamanan pengguna dalam mengakses informasi
                        </p>
                        <p className="text-justify">
                            Website ini juga berperan sebagai media informasi dan promosi, sehingga pelanggan dapat lebih mengenal layanan dan keunggulan yang ditawarkan Zan Micro System. Dengan desain yang responsif dan estetis, website ini diharapkan mampu meningkatkan kepercayaan dan ketertarikan pengguna terhadap produk maupun layanan yang tersedia.
                        </p>
                        <p className="text-justify">
                            Melalui platform ini, Zan Micro System berkomitmen untuk terus berkembang dan menyediakan solusi terbaik di bidang teknologi, seiring dengan kebutuhan dunia bisnis yang dinamis.
                        </p>
                    </div>

                    <div className="w-fit md:w-1/3">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => copyCurrentUrl()} className="inline-flex z-10 space-x-2 font-medium bg-gradient-to-tl from-blue-500 to-blue-300 hover:to-blue-500 hover:active:from-blue-300 cursor-pointer transition px-6 py-2 rounded-full text-white items-center pointer-events-auto">
                                <Link />
                                <span>Copy Link</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
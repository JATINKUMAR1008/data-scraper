'use client'
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import GoogleSvg from "../../../../public/google-icon-logo-svgrepo-com.svg";
export function GoogleButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            aria-disabled={pending}
            className="mt-4 w-full text-xs text-muted-foreground flex hover:bg-muted transition-colors duration-100 gap-3 justify-center items-center rounded-sm border border-muted p-2"
        >
            {pending ? (
                <>
                <Loader2 size={20} className="animate-spin"/>
                Signing in...
                </>
                
            ) : (
                <>
                    <Image
                        priority
                        src={GoogleSvg}
                        alt="Google"
                        width={15}
                        height={20}
                    />
                    Continue with Google
                </>
            )}
        </button>
    )
}
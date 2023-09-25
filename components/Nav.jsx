"use client";

// import { MDBBtn } from "mdb-react-ui-kit";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';


export default function Nav() {
    const { data: session, status } = useSession();

    return (
        <div>

            <div className="w-full h-20 bg-[#003a64]" />
            <div className="w-full h-20 ml-4 bg-[#003a64] fixed flex top-0" style={{ zIndex: 1 }}>
                {session?.user ? (
                    <Button onClick={() => signOut()}>Sair</Button>
                ) : (
                    <Button onClick={() => signIn()}>Realizar autenticação do token</Button>
                )}

                <Link href="/" className="fix-center">
                    <Image
                        src="/images/logo.png"
                        alt="Picture of the author"
                        width={200}
                        height={80}
                    />
                </Link>
            </div>
        </div>
    );

};

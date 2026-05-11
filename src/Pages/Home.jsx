import { useState, useEffect } from "react";
import Header from "../Components/User/Header/Header";
import Hero from "../Components/User/Hero/Hero";
import CardGames from "../Components/User/Games/CardGames";
import ChangePasswordModal from "../Components/Modals/ChangePassword";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../Service/user/dataUser";


const FeriaHome = () => {


  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ['userData'],
    queryFn: getUser,
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {

    if(userData?.data?.password  === false){
      setShowPasswordModal(true);
    }

   
  }, [userData?.data?.password ]);

  return (
    <div className="min-h-screen bg-[#0d0a09] text-[#e7d4b5] font-sans pb-10">
      <Header />

      {/* Modal de Cambio de Password */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <Hero />

        <section className="mt-12">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xs uppercase tracking-[0.5em] font-black border-l-4 border-[#a27b5c] pl-4">
              Pabellones de Juego
            </h3>
            <button className="text-[10px] uppercase tracking-widest text-[#a27b5c] hover:text-white transition-colors">
              Ver todos →
            </button>
          </div>
          <CardGames />
        </section>
      </main>
    </div>
  );
};

export default FeriaHome;
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto py-4 px-4 flex items-center justify-between relative">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Pharmintex"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="font-bold text-teal-700 text-lg">PHARMINTEX</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#fonctionnalites"
            className="text-gray-600 hover:text-teal-700"
          >
            Fonctionnalités
          </a>
          <a href="#faq" className="text-gray-600 hover:text-teal-700">
            FAQ
          </a>
          <a
            href="#contactez-nous"
            className="text-gray-600 hover:text-teal-700"
          >
            Contactez-nous
          </a>
          <Button
            variant="outline"
            className="ml-4 border-teal-700 text-teal-700 hover:bg-teal-50"
          >
            Connectez-vous
          </Button>
        </nav>
        <Button
          variant="outline"
          className="md:hidden border-teal-700 text-teal-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          Menu
        </Button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 px-4 py-4 flex flex-col space-y-4 md:hidden">
            <a
              href="#fonctionnalites"
              className="text-gray-600 hover:text-teal-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fonctionnalités
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-teal-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#contactez-nous"
              className="text-gray-600 hover:text-teal-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contactez-nous
            </a>
            <Button
              variant="outline"
              className="border-teal-700 text-teal-700 hover:bg-teal-50 w-full"
            >
              Connectez-vous
            </Button>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white ">
          <div className="container mx-auto  flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-600 mb-4">
                Bienvenue sur Pharmintex
              </h1>
              <p className="text-neutral-500 max-w-lg">
                Votre allié numérique pour une analyse précise et sécurisée de
                vos prescriptions médicales.
              </p>
              <p className="text-neutral-500 mb-8 max-w-lg">
                Grâce à notre technologie avancée, détectez rapidement les
                interactions médicamenteuses, évitez les erreurs et optimisez la
                sécurité de vos traitements. Simple, rapide et fiable,{" "}
                <span className="italic font-medium">
                  conçu spécialement pour les professionnels de santé
                </span>
              </p>
              <Link href="/analyse">
                <Button className="bg-teal-700 hover:bg-teal-800 text-white w-full sm:w-auto">
                  Essayer Maintenant
                </Button>
              </Link>
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/hero-illustration.svg"
                alt="Pharmaintex illustration"
                width={500}
                height={300}
                className="relative z-10 max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fonctionnalites" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-600 mb-10 md:mb-16 relative">
              Nos fonctionnalités
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-16 h-0.25 bg-gray-600"></span>
            </h2>

            {/* Main Feature */}
            <div className="flex flex-col md:flex-row items-center mb-12 md:mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 mb-4">
                  Analyse des Interactions Médicamenteuses
                </h3>
                <p className="text-neutral-500 mb-6 max-w-lg">
                  Notre plateforme innovante vous propose une fonctionnalité de
                  détection des interactions entre vos médicaments pour garantir
                  votre sécurité de façon optimale.
                </p>
                <Link href="/analyse">
                  <Button className="bg-teal-700 hover:bg-teal-800 text-white w-full sm:w-auto">
                    Essayer Maintenant
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src="/feature-illustration.svg"
                  alt="Analyse des Interactions"
                  width={400}
                  height={400}
                  className="relative z-10 max-w-full h-auto"
                />
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-emerald-50 p-4 md:p-6 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <span className="text-red-500 text-xl">🔍</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-neutral-600">
                  Analyse de votre prescription
                </h4>
                <p className="text-neutral-500">
                  Cette fonctionnalité détecte les interactions entre vos
                  médicaments pour garantir votre sécurité.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 md:p-6 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <span className="text-yellow-500 text-xl">⚡</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-neutral-600">
                  Identification rapide
                </h4>
                <p className="text-neutral-500">
                  Analyse instantanée des interactions médicamenteuses pour
                  répondre aux situations.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 md:p-6 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-blue-500 text-xl">🔄</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-neutral-600">
                  Accès rapide aux alternatives
                </h4>
                <p className="text-neutral-500">
                  Identifiez immédiatement des options de remplacement
                  disponibles pour vos médicaments.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 md:p-6 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-green-500 text-xl">📋</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-neutral-600">
                  Administration des médicaments
                </h4>
                <p className="text-neutral-500">
                  La meilleure façon d&apos;administrer vos médicaments pour
                  optimiser leur efficacité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col-reverse md:flex-row items-center">
              <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
                <Image
                  src="/quiz-illustration.svg"
                  alt="Quiz illustration"
                  width={400}
                  height={400}
                  className="relative z-10 max-w-full h-auto"
                />
              </div>
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-700 mb-4">
                  Quiz sur Médicaments et Interactions
                </h3>
                <p className="text-neutral-500 mb-6 max-w-lg">
                  Testez vos connaissances avec notre quiz interactif pour
                  former les étudiants sur les médicaments et leurs interactions
                  complexes.
                </p>
                <Link href="/under-construction">
                  <Button className="bg-teal-700 hover:bg-teal-800 text-white w-full sm:w-auto">
                    Essayer Maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-12 bg-teal-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-6 max-w-2xl mx-auto px-2">
              Inscrivez-vous sur notre site pour bénéficier d&apos;une analyse
              d&apos;ordonnance sécurisée et d&apos;une optimisation de votre
              revue de thérapie pour vos patients.
            </p>
            <Button
              variant="secondary"
              className="text-teal-700 border-white bg-slate-50 w-full sm:w-auto"
            >
              Inscrivez-vous
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-600 text-center mb-10 md:mb-16 relative">
              FAQ
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-16 h-0.25 bg-gray-600"></span>
            </h2>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-md p-2">
                  <AccordionTrigger className="text-gray-600 text-left font-medium">
                    C&apos;est quoi Pharmintex?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Est une plateforme numérique algérienne spécialisée dans
                    l&apos;analyse des ordonnances médicales. Elle permet de
                    détecter les interactions médicamenteuses, de proposer des
                    alternatives en cas de contre-indications, et de renforcer
                    la sécurité des prescriptions — en particulier chez les
                    patients polymédiqués.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-md p-2">
                  <AccordionTrigger className="text-gray-600 text-left font-medium">
                    Pour qui est destiné Pharmintex?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    PharminteX s&apos;adresse aux professionnels de santé
                    (pharmaciens, médecins, infirmiers), ainsi qu&apos;aux
                    étudiants en sciences de la santé souhaitant approfondir
                    leurs connaissances en pharmacologie et en analyse
                    thérapeutique.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-md p-2">
                  <AccordionTrigger className="text-gray-600 text-left font-medium">
                    PharminteX remplace-t-elle un avis médical ?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Non. PharminteX est un outil d&apos;aide à la décision conçu
                    pour accompagner les professionnels dans l&apos;évaluation
                    des prescriptions. Elle ne remplace pas un diagnostic
                    médical, mais vient compléter l&apos;analyse clinique pour
                    améliorer la sécurité du traitement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-md p-2">
                  <AccordionTrigger className="text-gray-600 text-left font-medium">
                    Est-ce que l&apos;accès à Pharmintex nécessite un
                    abonnement?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Oui, l&apos;accès à PharminteX nécessite un abonnement. Cela
                    permet d&apos;assurer un service fiable, sécurisé et
                    régulièrement mis à jour. Plusieurs formules sont proposées
                    selon le profil de l&apos;utilisateur (professionnel de
                    santé, étudiant, établissement), avec un accès complet à
                    toutes les fonctionnalités.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contactez-nous" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-16 text-gray-600 relative">
              Contactez-nous
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-16 h-0.25 bg-gray-600"></span>
            </h2>

            <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto">
              <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-xl text-gray-600 font-semibold mb-4">
                  Envoyer un message
                </h3>
                <h4 className="text-l text-neutral-500 mb-4">
                  Remplir vos information ci-dessous
                </h4>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="subject"
                      placeholder="Nom et Prénom"
                      className="w-full px-3 py-2 border border-gray-200 text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-200 text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Votre message"
                      className="w-full px-3 py-2 border border-gray-200 text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                  </div>

                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                    Envoyer
                  </Button>
                </form>
              </div>

              <div className="w-full md:w-1/2 flex justify-center">
                <Image
                  src="/contact-illustration.svg"
                  alt="Contact"
                  width={400}
                  height={400}
                  className="relative z-10 max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-teal-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="mb-6 md:mb-0 w-full md:w-auto">
              <div className="flex items-center mb-4">
                <Image
                  src="/logo-white.svg"
                  alt="Pharmaintex"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="font-bold text-white text-lg">PHARMINTEX</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-teal-200">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <a href="#" className="text-white hover:text-teal-200">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-teal-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full md:w-auto mt-6 md:mt-0">
              <div>
                <h4 className="font-semibold mb-4">Liens</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-bold hover:text-teal-200">
                      Accueil
                    </a>
                  </li>
                  <li>
                    <a
                      href="#fonctionnalites"
                      className="text-sm hover:text-teal-200"
                    >
                      Fonctionnalités
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-sm hover:text-teal-200">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm mt-2 mb-4">
                  Rue Essaada , Bab Ezzouar, Alger, 16001
                </p>
                <p className="text-sm mt-2 mb-4">+2136 65 87 98 32</p>
                <p className="text-sm mt-2">pharmintex@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-teal-600 pt-4 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} Pharmintex. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

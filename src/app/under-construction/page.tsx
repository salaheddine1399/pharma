import Link from "next/link";
import {
  FlaskRoundIcon as Flask,
  Mail,
  ArrowLeft,
  Clock,
  Pill,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-teal-100 p-4">
      <Card className="max-w-3xl w-full shadow-lg border-0">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Left side - Illustration */}
            <div className="bg-teal-600/10 p-6 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
              <div className="relative h-64 w-64">
                <Flask className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-teal-600 w-20 h-20" />
                <Pill className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-teal-500 w-10 h-10 animate-bounce" />
                <div className="absolute inset-0 border-8 border-dashed border-teal-400/40 rounded-full animate-spin-slow"></div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="p-8 flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight text-teal-800 mb-2">
                Page En Construction
              </h1>
              <p className="text-gray-600 mb-6">
                Notre équipe travaille actuellement sur cette section. Nous
                mettons tout en œuvre pour vous offrir une expérience optimale.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress
                    value={65}
                    className="h-2 bg-teal-100"
                    indicatorClassName="bg-teal-600"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                asChild
                className="mt-auto border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 mt-8 text-center">
        Pour toute question, contactez-nous à{" "}
        <a
          href="mailto:support@pharmacie.com"
          className="text-teal-600 hover:underline"
        >
          support@pharmacie.com
        </a>
      </p>
    </div>
  );
}

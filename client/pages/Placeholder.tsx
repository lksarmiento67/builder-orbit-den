import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-brand-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-brand-600" />
          </div>
          <CardTitle className="text-2xl text-brand-900">{title}</CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Esta página está en construcción. ¡Pronto estará disponible con contenido increíble!
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
            <Button variant="outline" className="border-brand-300 text-brand-700 hover:bg-brand-50">
              Contáctanos para más info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

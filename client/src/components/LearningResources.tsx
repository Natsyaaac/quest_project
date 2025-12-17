import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Server, Palette, ExternalLink } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: typeof Code;
  color: string;
  links: { name: string; url: string }[];
}

const resources: Resource[] = [
  {
    id: "javascript",
    title: "JavaScript",
    description: "Pelajari bahasa pemrograman web",
    icon: Code,
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    links: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { name: "JavaScript.info", url: "https://javascript.info/" },
      { name: "W3Schools JS", url: "https://www.w3schools.com/js/" },
      { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
    ],
  },
  {
    id: "php",
    title: "PHP",
    description: "Bahasa scripting server-side",
    icon: Server,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    links: [
      { name: "PHP Manual", url: "https://www.php.net/manual/en/" },
      { name: "W3Schools PHP", url: "https://www.w3schools.com/php/" },
      { name: "PHP The Right Way", url: "https://phptherightway.com/" },
      { name: "Laracasts", url: "https://laracasts.com/" },
    ],
  },
  {
    id: "css",
    title: "CSS",
    description: "Percantik tampilan halaman web",
    icon: Palette,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    links: [
      { name: "MDN CSS Guide", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { name: "CSS-Tricks", url: "https://css-tricks.com/" },
      { name: "W3Schools CSS", url: "https://www.w3schools.com/css/" },
      { name: "Flexbox Froggy", url: "https://flexboxfroggy.com/" },
    ],
  },
];

export function LearningResources() {
  return (
    <section className="space-y-4" data-testid="section-learning-resources">
      <h2 className="text-xl md:text-2xl font-semibold">Sumber Belajar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const IconComponent = resource.icon;
          return (
            <Card key={resource.id} className="hover-elevate" data-testid={`card-resource-${resource.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${resource.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {resource.links.map((link) => (
                    <Button
                      key={link.name}
                      variant="ghost"
                      className="w-full justify-between text-sm h-auto py-2"
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-${resource.id}-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

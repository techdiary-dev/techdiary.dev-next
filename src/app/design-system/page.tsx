import BaseLayout from "@/components/layout/BaseLayout";
import React from "react";

const DesignSystemPage = () => {
  return (
    <BaseLayout>
      <div className="wrapper py-8 space-y-12">
        {/* Colors Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Primary</h3>
              <div className="bg-primary text-primary-foreground h-12 rounded-md grid place-items-center">
                Primary
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Secondary</h3>
              <div className="bg-secondary text-secondary-foreground h-12 rounded-md grid place-items-center">
                Secondary
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Accent</h3>
              <div className="bg-accent text-accent-foreground h-12 rounded-md grid place-items-center">
                Accent
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Muted</h3>
              <div className="bg-muted text-muted-foreground h-12 rounded-md grid place-items-center">
                Muted
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Destructive</h3>
              <div className="bg-destructive text-destructive-forground h-12 rounded-md grid place-items-center">
                Destructive
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Border</h3>
              <div className="border-2 border-border h-12 rounded-md grid place-items-center">
                Border
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Font Families</h3>
              <div className="space-y-2">
                <p className="font-sans">Sans Font (Geist Sans)</p>
                <p className="font-mono">Mono Font (Geist Mono)</p>
                <p className="font-Kohinoor-bangla">Kohinoor Bangla</p>
                <p className="font-siliguri">Hind Siliguri</p>
                <p className="font-boshonto">Boshonto</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Text Sizes</h3>
              <div className="space-y-2">
                <p className="text-xs">Extra Small (text-xs)</p>
                <p className="text-sm">Small (text-sm)</p>
                <p className="text-base">Base (text-base)</p>
                <p className="text-lg">Large (text-lg)</p>
                <p className="text-xl">Extra Large (text-xl)</p>
                <p className="text-2xl">2XL (text-2xl)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Spacing</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="bg-muted h-4 w-1">1 (0.25rem)</div>
              <div className="bg-muted h-4 w-2">2 (0.5rem)</div>
              <div className="bg-muted h-4 w-4">4 (1rem)</div>
              <div className="bg-muted h-4 w-8">8 (2rem)</div>
              <div className="bg-muted h-4 w-12">12 (3rem)</div>
              <div className="bg-muted h-4 w-16">16 (4rem)</div>
            </div>
          </div>
        </section>

        {/* Border Radius Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Border Radius</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Small</h3>
              <div className="bg-primary h-12 rounded-sm"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Medium</h3>
              <div className="bg-primary h-12 rounded-md"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Large</h3>
              <div className="bg-primary h-12 rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Shadows Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Shadows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Small</h3>
              <div className="bg-card h-12 rounded-md shadow-sm"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Medium</h3>
              <div className="bg-card h-12 rounded-md shadow-md"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Large</h3>
              <div className="bg-card h-12 rounded-md shadow-lg"></div>
            </div>
          </div>
        </section>

        {/* Interactive States */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Interactive States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Buttons</h3>
              <div className="space-y-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90">
                  Secondary Button
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Links</h3>
              <div className="space-y-2">
                <a href="#" className="text-primary hover:underline">
                  Primary Link
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Muted Link
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BaseLayout>
  );
};

export default DesignSystemPage;

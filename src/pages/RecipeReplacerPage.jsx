import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Upload, Sparkles, ChefHat, Leaf, WheatOff, MilkOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const RecipeReplacerPage = () => {
  const [recipeText, setRecipeText] = useState('');
  const [preferences, setPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [allPrefs, setAllPrefs] = useState([
    { id: 'vegan', label: 'Vegan', icon: <Leaf className="h-5 w-5 text-green-500" /> },
    { id: 'jain', label: 'Jain', icon: <ChefHat className="h-5 w-5 text-yellow-500" /> },
    { id: 'gluten-free', label: 'Gluten-Free', icon: <WheatOff className="h-5 w-5 text-orange-500" /> },
    { id: 'dairy-free', label: 'Dairy-Free', icon: <MilkOff className="h-5 w-5 text-blue-400" /> },
  ]);
  const [newPrefText, setNewPrefText] = useState('');
  const { toast } = useToast();
  const [symptomsText, setSymptomsText] = useState('');


  const handlePreferenceChange = (id) => {
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addNewPreference = () => {
    const trimmed = newPrefText.trim();
    if (!trimmed) return;

    const newId = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (allPrefs.find(p => p.id === newId)) return;

    setAllPrefs(prev => [...prev, { id: newId, label: trimmed }]);
    setNewPrefText('');
  };

  const removePreference = (id) => {
    setAllPrefs(prev => prev.filter(pref => pref.id !== id));
    setPreferences(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipeText.trim()) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something is missing.",
        description: "Please enter a recipe to get started.",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      // Mock AI response
      setResult({
        original: recipeText,
        converted: "Here's the new and improved, allergy-friendly version of your recipe...",
        swaps: [
          { from: '1 cup milk', to: '1 cup almond milk', reason: 'Replaced dairy with a plant-based alternative.' },
          { from: '2 eggs', to: '2 tbsp flaxseed meal + 6 tbsp water', reason: 'Standard vegan egg replacement.' },
        ],
        nutrition: { calories: 350, protein: '15g', carbs: '40g', fat: '15g' }
      });
      setIsLoading(false);
    }, 2500);
  };

  return (
    <>
      <Helmet>
        <title>AI Recipe Replacer - SwasthAI</title>
        <meta name="description" content="Upload your recipe and select dietary preferences to get safe and delicious ingredient alternatives from our AI." />
      </Helmet>

      <div className="main-container">
        <div className="text-center">
          <h1 className="page-title">AI Recipe Replacer</h1>
          <p className="page-description">Transform any recipe to fit your dietary needs. Just paste your recipe, select your preferences, and let our AI do the rest!</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glassmorphism rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Label htmlFor="recipe-input" className="text-lg font-semibold mb-2 block">1. Paste Your Recipe</Label>
                    <Textarea
                      id="recipe-input"
                      placeholder="e.g., 1. Mix 1 cup of flour..."
                      className="h-48 text-base"
                      value={recipeText}
                      onChange={(e) => setRecipeText(e.target.value)}
                    />
                    <div className="mt-4 flex items-center gap-4">
                      <Button type="button" variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                      </Button>
                      <p className="text-sm text-muted-foreground">or paste text above.</p>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">2. Select Your Preferences</Label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {allPrefs.map(option => (
                        <div key={option.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={!!preferences[option.id]}
                              onCheckedChange={() => handlePreferenceChange(option.id)}
                            />
                            <Label htmlFor={option.id} className="flex items-center gap-2 text-base cursor-pointer">
                              {option.icon || <ChefHat className="h-5 w-5 text-muted-foreground" />} {option.label}
                            </Label>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => removePreference(option.id)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-grow p-2 rounded-md bg-background/70 border border-border text-white placeholder:text-muted-foreground"
                        placeholder="Add custom preference (e.g., nut-free)"
                        value={newPrefText}
                        onChange={(e) => setNewPrefText(e.target.value)}
                      />
                      <Button type="button" variant="outline" onClick={addNewPreference}>Add</Button>
                    </div>
                  </div>
                  {/* 3. Medical Symptoms */}
                  <div>
                    <Label htmlFor="symptoms-input" className="text-lg font-semibold mb-2 block">3. Medical Symptoms</Label>
                    <Textarea
                      id="symptoms-input"
                      placeholder="e.g., bloating, headaches, fatigue..."
                      className="h-48 text-base"
                      value={symptomsText}
                      onChange={(e) => setSymptomsText(e.target.value)}
                    />
                    <div className="mt-4 text-center">
                      <Button type="button" variant="outline" onClick={() => {
                        if (!symptomsText.trim()) {
                          toast({
                            variant: "destructive",
                            title: "Missing Symptoms",
                            description: "Please enter some symptoms to analyze.",
                          });
                          return;
                        }
                        toast({
                          title: "Symptoms submitted",
                          description: "Our AI will consider these during recipe transformation.",
                        });
                      }}>
                        Submit Symptoms
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button size="lg" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Recipe...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Fix My Recipe
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Your Transformed Recipe ✨</h2>
              <Card className="glassmorphism rounded-2xl">
                <CardHeader>
                  <CardTitle>Ingredient Swaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {result.swaps.map((swap, index) => (
                      <li key={index} className="p-4 bg-background/50 rounded-lg">
                        <p><span className="font-bold text-destructive">Original:</span> {swap.from}</p>
                        <p><span className="font-bold text-green-500">Swapped:</span> {swap.to}</p>
                        <p className="text-sm text-muted-foreground mt-1"><span className="font-semibold">Reason:</span> {swap.reason}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default RecipeReplacerPage;

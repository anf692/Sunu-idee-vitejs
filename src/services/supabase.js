import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// READ
export async function chargerIdees() {
  const { data, error } = await supabaseClient
    .from("idees")
    .select("*");
  if (error) throw error;
  return data;
}

// CREATE
export async function ajouterIdee(titre, categorie, description) {
  const { error } = await supabaseClient
    .from("idees")
    .insert([{ titre, categorie, description }]);
  if (error) throw error;
}

// UPDATE
export async function modifierIdee(id, titre, categorie, description) {
  const { error } = await supabaseClient
    .from("idees")
    .update({ titre, categorie, description })
    .eq("id", id);
  if (error) throw error;
}

// DELETE
export async function supprimerIdee(id) {
  const { error } = await supabaseClient
    .from("idees")
    .delete()
    .eq("id", id);
  if (error) throw error;
}




import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getOrCreateChat(productId: string, buyerId: string, sellerId: string): Promise<string> {
  // Generar un ID de conversación único basado en los IDs de producto, comprador y vendedor
  // Este ID se usará para agrupar lógicamente los mensajes en el frontend
  const conversationIdentifier = `${productId}-${[buyerId, sellerId].sort().join("-")}`;

  // Buscar si ya existe algún mensaje para esta combinación de product_id, buyer_id y seller_id
  const { data: existingMessages, error: fetchError } = await supabase
    .from("messages")
    .select("id") // Solo necesitamos verificar la existencia
    .eq("product_id", productId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .limit(1);

  if (fetchError) {
    console.error("Error fetching existing chat:", JSON.stringify(fetchError));
    throw fetchError;
  }

  if (existingMessages && existingMessages.length > 0) {
    return conversationIdentifier; // Ya existe un chat, devolver el identificador lógico
  }

  // Si no existe ningún mensaje, crear el primer mensaje
  const { error: insertError } = await supabase
    .from("messages")
    .insert({
      product_id: productId,
      buyer_id: buyerId, // ID del comprador
      seller_id: sellerId, // ID del vendedor
      content: "Hola, me interesa este producto.", // Mensaje automático
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error("Error creating new chat with initial message:", insertError);
    throw insertError;
  }

  return conversationIdentifier; // Devolver el identificador lógico del nuevo chat
}

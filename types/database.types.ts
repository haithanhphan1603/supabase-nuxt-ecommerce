export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          id: string
          name: string
          userId: string
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string | null
          id?: string
          name: string
          userId?: string
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          name?: string
          userId?: string
          zipcode?: string
        }
        Relationships: []
      }
      cart: {
        Row: {
          createdat: string | null
          createdby: string | null
          currency: string | null
          id: string
          totalprice: number | null
          updatedat: string | null
        }
        Insert: {
          createdat?: string | null
          createdby?: string | null
          currency?: string | null
          id?: string
          totalprice?: number | null
          updatedat?: string | null
        }
        Update: {
          createdat?: string | null
          createdby?: string | null
          currency?: string | null
          id?: string
          totalprice?: number | null
          updatedat?: string | null
        }
        Relationships: []
      }
      cartItems: {
        Row: {
          cartId: string | null
          id: string
          price: number
          productId: number | null
          quantity: number
        }
        Insert: {
          cartId?: string | null
          id?: string
          price: number
          productId?: number | null
          quantity: number
        }
        Update: {
          cartId?: string | null
          id?: string
          price?: number
          productId?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cartItem_cartId_fkey"
            columns: ["cartId"]
            isOneToOne: false
            referencedRelation: "cart"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          backgroundImage: string | null
          description: string | null
          id: number
          name: string
          slug: string | null
        }
        Insert: {
          backgroundImage?: string | null
          description?: string | null
          id?: never
          name: string
          slug?: string | null
        }
        Update: {
          backgroundImage?: string | null
          description?: string | null
          id?: never
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      orderItems: {
        Row: {
          id: number
          orderId: number | null
          price: number | null
          productId: number | null
          quantity: number | null
        }
        Insert: {
          id?: number
          orderId?: number | null
          price?: number | null
          productId?: number | null
          quantity?: number | null
        }
        Update: {
          id?: number
          orderId?: number | null
          price?: number | null
          productId?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_lines_order_id_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_product_id_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          addressId: string | null
          createdAt: string | null
          id: number
          orderStatus: Database["public"]["Enums"]["orderStatus"] | null
          stripeId: string | null
          updatedAt: string | null
          userId: string | null
        }
        Insert: {
          addressId?: string | null
          createdAt?: string | null
          id?: number
          orderStatus?: Database["public"]["Enums"]["orderStatus"] | null
          stripeId?: string | null
          updatedAt?: string | null
          userId?: string | null
        }
        Update: {
          addressId?: string | null
          createdAt?: string | null
          id?: number
          orderStatus?: Database["public"]["Enums"]["orderStatus"] | null
          stripeId?: string | null
          updatedAt?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_addressId_fkey"
            columns: ["addressId"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          createdAt: string | null
          currency: string | null
          description: string | null
          id: number
          imageUrls: string[] | null
          inStock: boolean | null
          name: string
          primaryCategoryId: number | null
          primaryImage: string | null
          productType: Database["public"]["Enums"]["productType"] | null
          slug: string | null
          unitPrice: number | null
          updatedAt: string | null
          vendorId: number | null
        }
        Insert: {
          createdAt?: string | null
          currency?: string | null
          description?: string | null
          id?: never
          imageUrls?: string[] | null
          inStock?: boolean | null
          name: string
          primaryCategoryId?: number | null
          primaryImage?: string | null
          productType?: Database["public"]["Enums"]["productType"] | null
          slug?: string | null
          unitPrice?: number | null
          updatedAt?: string | null
          vendorId?: number | null
        }
        Update: {
          createdAt?: string | null
          currency?: string | null
          description?: string | null
          id?: never
          imageUrls?: string[] | null
          inStock?: boolean | null
          name?: string
          primaryCategoryId?: number | null
          primaryImage?: string | null
          productType?: Database["public"]["Enums"]["productType"] | null
          slug?: string | null
          unitPrice?: number | null
          updatedAt?: string | null
          vendorId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_primaryCategoryId_fkey"
            columns: ["primaryCategoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendorId"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products_categories: {
        Row: {
          categoryId: number
          productId: number
        }
        Insert: {
          categoryId: number
          productId: number
        }
        Update: {
          categoryId?: number
          productId?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_categories_categoryid_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_categories_productid_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          firstname: string | null
          id: string
          lastname: string | null
        }
        Insert: {
          firstname?: string | null
          id: string
          lastname?: string | null
        }
        Update: {
          firstname?: string | null
          id?: string
          lastname?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: number
          productId: number | null
          rating: number | null
          reviewText: string | null
          timestamp: string | null
          userId: string | null
        }
        Insert: {
          id?: never
          productId?: number | null
          rating?: number | null
          reviewText?: string | null
          timestamp?: string | null
          userId?: string | null
        }
        Update: {
          id?: never
          productId?: number | null
          rating?: number | null
          reviewText?: string | null
          timestamp?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          background: string | null
          createdAt: string
          id: number
          image: string | null
          name: string | null
          slug: string | null
        }
        Insert: {
          background?: string | null
          createdAt?: string
          id?: number
          image?: string | null
          name?: string | null
          slug?: string | null
        }
        Update: {
          background?: string | null
          createdAt?: string
          id?: number
          image?: string | null
          name?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          id: string
          product_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_add_to_wishlist: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      get_wishlist_count: {
        Args: { user_uuid: string }
        Returns: number
      }
      is_member_of: {
        Args: { _user_id: string; _cart_id: string }
        Returns: boolean
      }
      search_products_by_name_prefix: {
        Args: { prefix: string }
        Returns: {
          createdAt: string | null
          currency: string | null
          description: string | null
          id: number
          imageUrls: string[] | null
          inStock: boolean | null
          name: string
          primaryCategoryId: number | null
          primaryImage: string | null
          productType: Database["public"]["Enums"]["productType"] | null
          slug: string | null
          unitPrice: number | null
          updatedAt: string | null
          vendorId: number | null
        }[]
      }
      slugify: {
        Args: { value: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      orderStatus:
        | "Pending"
        | "Confirmed"
        | "Processed"
        | "Shipped"
        | "Delivered"
        | "Cancelled"
      productType: "LP" | "2LP" | "CD" | "CD+DVD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      orderStatus: [
        "Pending",
        "Confirmed",
        "Processed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      productType: ["LP", "2LP", "CD", "CD+DVD"],
    },
  },
} as const

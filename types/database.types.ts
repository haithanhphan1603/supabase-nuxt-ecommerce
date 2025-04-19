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
          addressType: string | null
          city: string | null
          country: string | null
          id: number
          postalCode: string | null
          state: string | null
          streetAddress: string | null
          userId: string | null
        }
        Insert: {
          addressType?: string | null
          city?: string | null
          country?: string | null
          id?: number
          postalCode?: string | null
          state?: string | null
          streetAddress?: string | null
          userId?: string | null
        }
        Update: {
          addressType?: string | null
          city?: string | null
          country?: string | null
          id?: number
          postalCode?: string | null
          state?: string | null
          streetAddress?: string | null
          userId?: string | null
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
      cartItem: {
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
      orderItem: {
        Row: {
          id: number
          orderId: number | null
          price: number | null
          productId: number | null
          quantity: number | null
        }
        Insert: {
          id?: never
          orderId?: number | null
          price?: number | null
          productId?: number | null
          quantity?: number | null
        }
        Update: {
          id?: never
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
          createdAt: string | null
          id: number
          orderStatus: Database["public"]["Enums"]["orderStatus"] | null
          updatedAt: string | null
          userId: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: never
          orderStatus?: Database["public"]["Enums"]["orderStatus"] | null
          updatedAt?: string | null
          userId?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: never
          orderStatus?: Database["public"]["Enums"]["orderStatus"] | null
          updatedAt?: string | null
          userId?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          createdAt: string | null
          currency: string | null
          id: number
          orderId: number | null
          paymentMethod: string | null
          paymentStatus: string | null
          transactionId: string | null
          updatedAt: string | null
        }
        Insert: {
          amount?: number | null
          createdAt?: string | null
          currency?: string | null
          id?: number
          orderId?: number | null
          paymentMethod?: string | null
          paymentStatus?: string | null
          transactionId?: string | null
          updatedAt?: string | null
        }
        Update: {
          amount?: number | null
          createdAt?: string | null
          currency?: string | null
          id?: number
          orderId?: number | null
          paymentMethod?: string | null
          paymentStatus?: string | null
          transactionId?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
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
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      get_wishlist_count: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      is_member_of: {
        Args: {
          _user_id: string
          _cart_id: string
        }
        Returns: boolean
      }
      search_products_by_name_prefix: {
        Args: {
          prefix: string
        }
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
        Args: {
          value: string
        }
        Returns: string
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
      admins: {
        Row: {
          admin_uuid: string
          created_at: string
          id: number
          user_uuid: string | null
        }
        Insert: {
          admin_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string | null
        }
        Update: {
          admin_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      affiliate_products: {
        Row: {
          affiliate_products_uuid: string
          affiliate_share: number | null
          affiliate_uuid: string | null
          created_at: string
          expert_share: number | null
          id: number
          product_uuid: string | null
        }
        Insert: {
          affiliate_products_uuid?: string
          affiliate_share?: number | null
          affiliate_uuid?: string | null
          created_at?: string
          expert_share?: number | null
          id?: number
          product_uuid?: string | null
        }
        Update: {
          affiliate_products_uuid?: string
          affiliate_share?: number | null
          affiliate_uuid?: string | null
          created_at?: string
          expert_share?: number | null
          id?: number
          product_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_products_affiliate_uuid_fkey"
            columns: ["affiliate_uuid"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["affiliate_uuid"]
          },
          {
            foreignKeyName: "affiliate_products_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string | null
          affiliate_count: number | null
          affiliate_uuid: string
          commissions_available: number | null
          commissions_made: number | null
          commissions_paid: number | null
          created_at: string
          email: string | null
          id: number
          paypal: string | null
          status: Database["public"]["Enums"]["affiliate_status"] | null
          transaction_count: number | null
        }
        Insert: {
          affiliate_code?: string | null
          affiliate_count?: number | null
          affiliate_uuid?: string
          commissions_available?: number | null
          commissions_made?: number | null
          commissions_paid?: number | null
          created_at?: string
          email?: string | null
          id?: number
          paypal?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"] | null
          transaction_count?: number | null
        }
        Update: {
          affiliate_code?: string | null
          affiliate_count?: number | null
          affiliate_uuid?: string
          commissions_available?: number | null
          commissions_made?: number | null
          commissions_paid?: number | null
          created_at?: string
          email?: string | null
          id?: number
          paypal?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"] | null
          transaction_count?: number | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          application_uuid: string
          bid_amount: number | null
          created_at: string
          id: number
          job_uuid: string | null
          message: string | null
          status: Database["public"]["Enums"]["applications_status"] | null
          user_email: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          application_uuid?: string
          bid_amount?: number | null
          created_at?: string
          id?: number
          job_uuid?: string | null
          message?: string | null
          status?: Database["public"]["Enums"]["applications_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          application_uuid?: string
          bid_amount?: number | null
          created_at?: string
          id?: number
          job_uuid?: string | null
          message?: string | null
          status?: Database["public"]["Enums"]["applications_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_uuid_fkey"
            columns: ["job_uuid"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_uuid"]
          },
          {
            foreignKeyName: "applications_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      articles: {
        Row: {
          article_uuid: string
          created_at: string
          description: string | null
          html: string | null
          id: number
          keyword: string | null
          lecture_time: number | null
          slug: string | null
          title: string | null
          url: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          article_uuid?: string
          created_at?: string
          description?: string | null
          html?: string | null
          id?: number
          keyword?: string | null
          lecture_time?: number | null
          slug?: string | null
          title?: string | null
          url?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          article_uuid?: string
          created_at?: string
          description?: string | null
          html?: string | null
          id?: number
          keyword?: string | null
          lecture_time?: number | null
          slug?: string | null
          title?: string | null
          url?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      classrooms: {
        Row: {
          classroom_uuid: string
          community_uuid: string | null
          created_at: string
          description: string | null
          expert_uuid: string | null
          id: number
          lesson_count: number | null
          name: string | null
          notified: boolean | null
          notify: boolean | null
          status: Database["public"]["Enums"]["classroom_status"] | null
          summary: string | null
          thumbnail: string | null
          video_url: string | null
        }
        Insert: {
          classroom_uuid?: string
          community_uuid?: string | null
          created_at?: string
          description?: string | null
          expert_uuid?: string | null
          id?: number
          lesson_count?: number | null
          name?: string | null
          notified?: boolean | null
          notify?: boolean | null
          status?: Database["public"]["Enums"]["classroom_status"] | null
          summary?: string | null
          thumbnail?: string | null
          video_url?: string | null
        }
        Update: {
          classroom_uuid?: string
          community_uuid?: string | null
          created_at?: string
          description?: string | null
          expert_uuid?: string | null
          id?: number
          lesson_count?: number | null
          name?: string | null
          notified?: boolean | null
          notify?: boolean | null
          status?: Database["public"]["Enums"]["classroom_status"] | null
          summary?: string | null
          thumbnail?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "classrooms_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
        ]
      }
      communities: {
        Row: {
          active_price_id: string | null
          active_product_id: string | null
          billing_period:
            | Database["public"]["Enums"]["community_billing_period"]
            | null
          classroom_count: number | null
          community_price_uuid: string | null
          community_uuid: string
          created_at: string
          description: string | null
          expert_name: string | null
          expert_thumbnail: string | null
          expert_uuid: string | null
          id: number
          intro: string | null
          last_activity: string | null
          links: Json | null
          member_count: number | null
          monthly_recurring_revenue: number | null
          name: string | null
          paid_member_count: number | null
          payment_link: string | null
          post_count: number | null
          price: number | null
          product_count: number | null
          slug: string | null
          thumbnail: string | null
          title: string | null
          total_revenue: number | null
          type: Database["public"]["Enums"]["community_type"] | null
          user_uuid: string | null
          visibility: Database["public"]["Enums"]["community_visibility"] | null
          webhook: string | null
        }
        Insert: {
          active_price_id?: string | null
          active_product_id?: string | null
          billing_period?:
            | Database["public"]["Enums"]["community_billing_period"]
            | null
          classroom_count?: number | null
          community_price_uuid?: string | null
          community_uuid?: string
          created_at?: string
          description?: string | null
          expert_name?: string | null
          expert_thumbnail?: string | null
          expert_uuid?: string | null
          id?: number
          intro?: string | null
          last_activity?: string | null
          links?: Json | null
          member_count?: number | null
          monthly_recurring_revenue?: number | null
          name?: string | null
          paid_member_count?: number | null
          payment_link?: string | null
          post_count?: number | null
          price?: number | null
          product_count?: number | null
          slug?: string | null
          thumbnail?: string | null
          title?: string | null
          total_revenue?: number | null
          type?: Database["public"]["Enums"]["community_type"] | null
          user_uuid?: string | null
          visibility?:
            | Database["public"]["Enums"]["community_visibility"]
            | null
          webhook?: string | null
        }
        Update: {
          active_price_id?: string | null
          active_product_id?: string | null
          billing_period?:
            | Database["public"]["Enums"]["community_billing_period"]
            | null
          classroom_count?: number | null
          community_price_uuid?: string | null
          community_uuid?: string
          created_at?: string
          description?: string | null
          expert_name?: string | null
          expert_thumbnail?: string | null
          expert_uuid?: string | null
          id?: number
          intro?: string | null
          last_activity?: string | null
          links?: Json | null
          member_count?: number | null
          monthly_recurring_revenue?: number | null
          name?: string | null
          paid_member_count?: number | null
          payment_link?: string | null
          post_count?: number | null
          price?: number | null
          product_count?: number | null
          slug?: string | null
          thumbnail?: string | null
          title?: string | null
          total_revenue?: number | null
          type?: Database["public"]["Enums"]["community_type"] | null
          user_uuid?: string | null
          visibility?:
            | Database["public"]["Enums"]["community_visibility"]
            | null
          webhook?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_community_price_uuid_fkey"
            columns: ["community_price_uuid"]
            isOneToOne: false
            referencedRelation: "community_prices"
            referencedColumns: ["community_price_uuid"]
          },
          {
            foreignKeyName: "communities_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
          {
            foreignKeyName: "communities_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      community_images: {
        Row: {
          alt_text: string | null
          community_uuid: string | null
          content_type: string | null
          created_at: string | null
          file_name: string | null
          id: number
          is_primary: boolean | null
          size: number | null
          storage_path: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          community_uuid?: string | null
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: never
          is_primary?: boolean | null
          size?: number | null
          storage_path: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          community_uuid?: string | null
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: never
          is_primary?: boolean | null
          size?: number | null
          storage_path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_images_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
        ]
      }
      community_prices: {
        Row: {
          amount: number | null
          community_price_uuid: string
          community_uuid: string | null
          created_at: string
          id: number
          status: Database["public"]["Enums"]["community_price_status"] | null
          stripe_id: string | null
          total_amount: number | null
        }
        Insert: {
          amount?: number | null
          community_price_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["community_price_status"] | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Update: {
          amount?: number | null
          community_price_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["community_price_status"] | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_prices_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
        ]
      }
      community_product_relationships: {
        Row: {
          community_product_uuid: string
          community_uuid: string
          created_at: string
          id: number
          user_uuid: string
        }
        Insert: {
          community_product_uuid: string
          community_uuid: string
          created_at?: string
          id?: number
          user_uuid: string
        }
        Update: {
          community_product_uuid?: string
          community_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_product_relationships_community_product_id_fkey"
            columns: ["community_product_uuid"]
            isOneToOne: false
            referencedRelation: "community_products"
            referencedColumns: ["community_product_uuid"]
          },
          {
            foreignKeyName: "community_product_relationships_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
        ]
      }
      community_products: {
        Row: {
          classroom_uuid: string | null
          community_product_uuid: string
          community_uuid: string | null
          created_at: string
          expert_uuid: string | null
          files_link: string | null
          id: number
          name: string
          payment_link: string | null
          price: number | null
          product_type:
            | Database["public"]["Enums"]["community_product_type"]
            | null
        }
        Insert: {
          classroom_uuid?: string | null
          community_product_uuid?: string
          community_uuid?: string | null
          created_at?: string
          expert_uuid?: string | null
          files_link?: string | null
          id?: number
          name?: string
          payment_link?: string | null
          price?: number | null
          product_type?:
            | Database["public"]["Enums"]["community_product_type"]
            | null
        }
        Update: {
          classroom_uuid?: string | null
          community_product_uuid?: string
          community_uuid?: string | null
          created_at?: string
          expert_uuid?: string | null
          files_link?: string | null
          id?: number
          name?: string
          payment_link?: string | null
          price?: number | null
          product_type?:
            | Database["public"]["Enums"]["community_product_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "community_products_classroom_uuid_fkey"
            columns: ["classroom_uuid"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["classroom_uuid"]
          },
          {
            foreignKeyName: "community_products_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "community_products_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
        ]
      }
      community_subscriptions: {
        Row: {
          cancelled_at: string | null
          commnity_name: string | null
          community_price_uuid: string | null
          community_subscription_uuid: string
          community_uuid: string | null
          created_at: string
          id: number
          seller_user_uuid: string | null
          status:
            | Database["public"]["Enums"]["community_subscription_status"]
            | null
          stripe_id: string | null
          total_amount: number | null
          type:
            | Database["public"]["Enums"]["commnunity_subscription_type"]
            | null
          user_uuid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          cancelled_at?: string | null
          commnity_name?: string | null
          community_price_uuid?: string | null
          community_subscription_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["community_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          type?:
            | Database["public"]["Enums"]["commnunity_subscription_type"]
            | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          cancelled_at?: string | null
          commnity_name?: string | null
          community_price_uuid?: string | null
          community_subscription_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["community_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          type?:
            | Database["public"]["Enums"]["commnunity_subscription_type"]
            | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_subscriptions_community_price_uuid_fkey"
            columns: ["community_price_uuid"]
            isOneToOne: false
            referencedRelation: "community_prices"
            referencedColumns: ["community_price_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      community_subscriptions_transactions: {
        Row: {
          amount: number | null
          community_price_uuid: string | null
          community_subscription_transaction_uuid: string
          community_uuid: string | null
          created_at: string
          id: number
          stripe_id: string | null
        }
        Insert: {
          amount?: number | null
          community_price_uuid?: string | null
          community_subscription_transaction_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          stripe_id?: string | null
        }
        Update: {
          amount?: number | null
          community_price_uuid?: string | null
          community_subscription_transaction_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          stripe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_subscriptions_transactions_community_price_uuid_fkey"
            columns: ["community_price_uuid"]
            isOneToOne: false
            referencedRelation: "community_prices"
            referencedColumns: ["community_price_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_transactions_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
        ]
      }
      conversations: {
        Row: {
          archived: boolean | null
          conversation_uuid: string
          created_at: string
          draft_created: boolean | null
          id: number
          job_name: string | null
          job_uuid: string | null
          message_count: number | null
          product_name: string | null
          product_uuid: string | null
          source: Database["public"]["Enums"]["conversation_source"] | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          subject: string | null
          transaction_uuid: string | null
          user_recipient_name: string | null
          user_recipient_uuid: string | null
          user_starter_name: string | null
          user_starter_uuid: string | null
        }
        Insert: {
          archived?: boolean | null
          conversation_uuid?: string
          created_at?: string
          draft_created?: boolean | null
          id?: number
          job_name?: string | null
          job_uuid?: string | null
          message_count?: number | null
          product_name?: string | null
          product_uuid?: string | null
          source?: Database["public"]["Enums"]["conversation_source"] | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          transaction_uuid?: string | null
          user_recipient_name?: string | null
          user_recipient_uuid?: string | null
          user_starter_name?: string | null
          user_starter_uuid?: string | null
        }
        Update: {
          archived?: boolean | null
          conversation_uuid?: string
          created_at?: string
          draft_created?: boolean | null
          id?: number
          job_name?: string | null
          job_uuid?: string | null
          message_count?: number | null
          product_name?: string | null
          product_uuid?: string | null
          source?: Database["public"]["Enums"]["conversation_source"] | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          transaction_uuid?: string | null
          user_recipient_name?: string | null
          user_recipient_uuid?: string | null
          user_starter_name?: string | null
          user_starter_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_uuid_fkey"
            columns: ["job_uuid"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_uuid"]
          },
          {
            foreignKeyName: "conversations_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "conversations_transaction_uuid_fkey"
            columns: ["transaction_uuid"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_uuid"]
          },
          {
            foreignKeyName: "conversations_user_recipient_uuid_fkey"
            columns: ["user_recipient_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "conversations_user_starter_uuid_fkey"
            columns: ["user_starter_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          event_uuid: string
          id: number
        }
        Insert: {
          created_at?: string
          event_uuid?: string
          id?: number
        }
        Update: {
          created_at?: string
          event_uuid?: string
          id?: number
        }
        Relationships: []
      }
      expert_images: {
        Row: {
          alt_text: string | null
          content_type: string | null
          created_at: string
          expert_uuid: string
          file_name: string | null
          id: number
          is_primary: boolean | null
          size: number | null
          storage_path: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          content_type?: string | null
          created_at?: string
          expert_uuid: string
          file_name?: string | null
          id?: number
          is_primary?: boolean | null
          size?: number | null
          storage_path: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          content_type?: string | null
          created_at?: string
          expert_uuid?: string
          file_name?: string | null
          id?: number
          is_primary?: boolean | null
          size?: number | null
          storage_path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_images_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
        ]
      }
      experts: {
        Row: {
          areas: Json | null
          client_satisfaction: number | null
          completed_projects: number | null
          created_at: string
          description: string | null
          email: string | null
          expert_uuid: string
          id: number
          info: string | null
          location: string | null
          name: string | null
          response_rate: number | null
          sales_amount: number | null
          slug: string | null
          thumbnail: string | null
          title: string | null
          updated_at: string | null
          user_uuid: string | null
        }
        Insert: {
          areas?: Json | null
          client_satisfaction?: number | null
          completed_projects?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          expert_uuid?: string
          id?: number
          info?: string | null
          location?: string | null
          name?: string | null
          response_rate?: number | null
          sales_amount?: number | null
          slug?: string | null
          thumbnail?: string | null
          title?: string | null
          updated_at?: string | null
          user_uuid?: string | null
        }
        Update: {
          areas?: Json | null
          client_satisfaction?: number | null
          completed_projects?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          expert_uuid?: string
          id?: number
          info?: string | null
          location?: string | null
          name?: string | null
          response_rate?: number | null
          sales_amount?: number | null
          slug?: string | null
          thumbnail?: string | null
          title?: string | null
          updated_at?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experts_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      jobs: {
        Row: {
          amount: number | null
          applicant_count: number | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: number
          job_transaction_uuid: string | null
          job_uuid: string
          paid_at: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          tech_stack: string | null
          title: string | null
          transaction_uuid: string | null
          user_email: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          amount?: number | null
          applicant_count?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: number
          job_transaction_uuid?: string | null
          job_uuid?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tech_stack?: string | null
          title?: string | null
          transaction_uuid?: string | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          amount?: number | null
          applicant_count?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: number
          job_transaction_uuid?: string | null
          job_uuid?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tech_stack?: string | null
          title?: string | null
          transaction_uuid?: string | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_job_transaction_uuid_fkey"
            columns: ["job_transaction_uuid"]
            isOneToOne: false
            referencedRelation: "jobs_transactions"
            referencedColumns: ["job_transaction_uuid"]
          },
          {
            foreignKeyName: "jobs_transaction_uuid_fkey"
            columns: ["transaction_uuid"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_uuid"]
          },
          {
            foreignKeyName: "jobs_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      jobs_transactions: {
        Row: {
          created_at: string
          id: number
          job_transaction_uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          job_transaction_uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          job_transaction_uuid?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          classroom_uuid: string | null
          created_at: string
          description: string | null
          id: number
          introduction: string | null
          lesson_uuid: string
          name: string | null
          thumbnail_url: string | null
          user_uuid: string | null
          video_url: string | null
        }
        Insert: {
          classroom_uuid?: string | null
          created_at?: string
          description?: string | null
          id?: number
          introduction?: string | null
          lesson_uuid?: string
          name?: string | null
          thumbnail_url?: string | null
          user_uuid?: string | null
          video_url?: string | null
        }
        Update: {
          classroom_uuid?: string | null
          created_at?: string
          description?: string | null
          id?: number
          introduction?: string | null
          lesson_uuid?: string
          name?: string | null
          thumbnail_url?: string | null
          user_uuid?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_classroom_uuid_fkey"
            columns: ["classroom_uuid"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["classroom_uuid"]
          },
          {
            foreignKeyName: "lessons_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_uuid: string | null
          created_at: string
          id: number
          message_uuid: string
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          conversation_uuid?: string | null
          created_at?: string
          id?: number
          message_uuid?: string
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          conversation_uuid?: string | null
          created_at?: string
          id?: number
          message_uuid?: string
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_uuid_fkey"
            columns: ["conversation_uuid"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_uuid"]
          },
          {
            foreignKeyName: "messages_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          payout_uuid: string
          paypal: string | null
          status: Database["public"]["Enums"]["payout_status"] | null
          user_email: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          payout_uuid: string
          paypal?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          payout_uuid?: string
          paypal?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          content_type: string | null
          created_at: string | null
          file_name: string | null
          id: number
          is_primary: boolean | null
          product_image_uuid: string | null
          product_uuid: string
          size: number | null
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: number
          is_primary?: boolean | null
          product_image_uuid?: string | null
          product_uuid: string
          size?: number | null
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: number
          is_primary?: boolean | null
          product_image_uuid?: string | null
          product_uuid?: string
          size?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
        ]
      }
      product_relationships: {
        Row: {
          created_at: string
          display_order: number | null
          id: number
          product_uuid: string
          related_product_uuid: string | null
          relationship_type: string | null
          relationship_uuid: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: number
          product_uuid: string
          related_product_uuid?: string | null
          relationship_type?: string | null
          relationship_uuid?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: number
          product_uuid?: string
          related_product_uuid?: string | null
          relationship_type?: string | null
          relationship_uuid?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_relationships_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "product_relationships_related_product_uuid_fkey"
            columns: ["related_product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
        ]
      }
      products: {
        Row: {
          accept_terms: boolean | null
          affiliate_information: string | null
          affiliate_program: boolean | null
          affiliation_amount: number | null
          change_reasons: string | null
          changes_neeeded: string | null
          created_at: string
          demo: string | null
          description: string | null
          difficulty_level: string | null
          expert_uuid: string | null
          fees_amount: number | null
          free_or_paid:
            | Database["public"]["Enums"]["product_free_or_paid"]
            | null
          id: number
          industries: Json | null
          name: string | null
          platform: Json | null
          price_from: number | null
          product_includes: string | null
          product_uuid: string
          public_link: string | null
          related_products: string[] | null
          review_count: number | null
          reviewed_by: string | null
          sales_amount: number | null
          sales_count: number | null
          slug: string | null
          status: Database["public"]["Enums"]["product_status"] | null
          team: Json | null
          tech_stack: string | null
          tech_stack_price: string | null
          thumbnail: string | null
          type: Database["public"]["Enums"]["product_type"] | null
          use_case: Json | null
          user_uuid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant_count: number | null
        }
        Insert: {
          accept_terms?: boolean | null
          affiliate_information?: string | null
          affiliate_program?: boolean | null
          affiliation_amount?: number | null
          change_reasons?: string | null
          changes_neeeded?: string | null
          created_at?: string
          demo?: string | null
          description?: string | null
          difficulty_level?: string | null
          expert_uuid?: string | null
          fees_amount?: number | null
          free_or_paid?:
            | Database["public"]["Enums"]["product_free_or_paid"]
            | null
          id?: number
          industries?: Json | null
          name?: string | null
          platform?: Json | null
          price_from?: number | null
          product_includes?: string | null
          product_uuid?: string
          public_link?: string | null
          related_products?: string[] | null
          review_count?: number | null
          reviewed_by?: string | null
          sales_amount?: number | null
          sales_count?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          team?: Json | null
          tech_stack?: string | null
          tech_stack_price?: string | null
          thumbnail?: string | null
          type?: Database["public"]["Enums"]["product_type"] | null
          use_case?: Json | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_count?: number | null
        }
        Update: {
          accept_terms?: boolean | null
          affiliate_information?: string | null
          affiliate_program?: boolean | null
          affiliation_amount?: number | null
          change_reasons?: string | null
          changes_neeeded?: string | null
          created_at?: string
          demo?: string | null
          description?: string | null
          difficulty_level?: string | null
          expert_uuid?: string | null
          fees_amount?: number | null
          free_or_paid?:
            | Database["public"]["Enums"]["product_free_or_paid"]
            | null
          id?: number
          industries?: Json | null
          name?: string | null
          platform?: Json | null
          price_from?: number | null
          product_includes?: string | null
          product_uuid?: string
          public_link?: string | null
          related_products?: string[] | null
          review_count?: number | null
          reviewed_by?: string | null
          sales_amount?: number | null
          sales_count?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          team?: Json | null
          tech_stack?: string | null
          tech_stack_price?: string | null
          thumbnail?: string | null
          type?: Database["public"]["Enums"]["product_type"] | null
          use_case?: Json | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
          {
            foreignKeyName: "products_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      products_transaction_items: {
        Row: {
          created_at: string
          id: number
          price: number | null
          product_transaction_item_uuid: string
          product_transaction_uuid: string
          product_type: string | null
          product_uuid: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["transaction_item_status"] | null
          tax: number | null
          total_price: number | null
          updated_at: string | null
          variant_uuid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          price?: number | null
          product_transaction_item_uuid?: string
          product_transaction_uuid: string
          product_type?: string | null
          product_uuid?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["transaction_item_status"] | null
          tax?: number | null
          total_price?: number | null
          updated_at?: string | null
          variant_uuid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          price?: number | null
          product_transaction_item_uuid?: string
          product_transaction_uuid?: string
          product_type?: string | null
          product_uuid?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["transaction_item_status"] | null
          tax?: number | null
          total_price?: number | null
          updated_at?: string | null
          variant_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_transaction_items_product_transaction_uuid_fkey"
            columns: ["product_transaction_uuid"]
            isOneToOne: false
            referencedRelation: "products_transactions"
            referencedColumns: ["product_transaction_uuid"]
          },
          {
            foreignKeyName: "products_transaction_items_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "products_transaction_items_variant_uuid_fkey"
            columns: ["variant_uuid"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["variant_uuid"]
          },
        ]
      }
      products_transactions: {
        Row: {
          created_at: string
          id: number
          item_count: number | null
          payment_link: string | null
          payment_provider:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_reference_id: string | null
          product_transaction_uuid: string
          status:
            | Database["public"]["Enums"]["product_transaction_status"]
            | null
          total_amount: number | null
          type: Database["public"]["Enums"]["product_transaction_type"] | null
          updated_at: string | null
          user_uuid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          item_count?: number | null
          payment_link?: string | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_reference_id?: string | null
          product_transaction_uuid?: string
          status?:
            | Database["public"]["Enums"]["product_transaction_status"]
            | null
          total_amount?: number | null
          type?: Database["public"]["Enums"]["product_transaction_type"] | null
          updated_at?: string | null
          user_uuid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          item_count?: number | null
          payment_link?: string | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_reference_id?: string | null
          product_transaction_uuid?: string
          status?:
            | Database["public"]["Enums"]["product_transaction_status"]
            | null
          total_amount?: number | null
          type?: Database["public"]["Enums"]["product_transaction_type"] | null
          updated_at?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_transactions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_email: string | null
          buyer_name: string | null
          comments: string | null
          created_at: string
          expert_uuid: string | null
          product_uuid: string | null
          rating: number | null
          review_uuid: string
          seller_user_uuid: string | null
          status: Database["public"]["Enums"]["review_status"] | null
          title: string | null
          transaction_type:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          transaction_uuid: string | null
          type: Database["public"]["Enums"]["review_type"] | null
          verified: boolean | null
        }
        Insert: {
          buyer_email?: string | null
          buyer_name?: string | null
          comments?: string | null
          created_at?: string
          expert_uuid?: string | null
          product_uuid?: string | null
          rating?: number | null
          review_uuid?: string
          seller_user_uuid?: string | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          transaction_uuid?: string | null
          type?: Database["public"]["Enums"]["review_type"] | null
          verified?: boolean | null
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string | null
          comments?: string | null
          created_at?: string
          expert_uuid?: string | null
          product_uuid?: string | null
          rating?: number | null
          review_uuid?: string
          seller_user_uuid?: string | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          transaction_uuid?: string | null
          type?: Database["public"]["Enums"]["review_type"] | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
          {
            foreignKeyName: "reviews_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "reviews_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "reviews_transaction_uuid_fkey"
            columns: ["transaction_uuid"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_uuid"]
          },
        ]
      }
      service_prices: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          service_price_status:
            | Database["public"]["Enums"]["service_price_status"]
            | null
          service_price_uuid: string
          service_uuid: string | null
          stripe_id: string | null
          total_amount: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          service_price_status?:
            | Database["public"]["Enums"]["service_price_status"]
            | null
          service_price_uuid?: string
          service_uuid?: string | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          service_price_status?:
            | Database["public"]["Enums"]["service_price_status"]
            | null
          service_price_uuid?: string
          service_uuid?: string | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_prices_service_uuid_fkey"
            columns: ["service_uuid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_uuid"]
          },
        ]
      }
      service_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          id: number
          seller_user_uuid: string | null
          service_subscription_uuid: string
          service_uuid: string | null
          status:
            | Database["public"]["Enums"]["service_subscription_status"]
            | null
          stripe_id: string | null
          total_amount: number | null
          user_uuid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_subscription_uuid?: string
          service_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["service_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_subscription_uuid?: string
          service_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["service_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_subscriptions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_service_uuid_fkey"
            columns: ["service_uuid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      service_subscriptions_transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          seller_user_uuid: string | null
          service_price_uuid: string | null
          service_subscription_transactions_uuid: string
          service_uuid: string | null
          user_uuid: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_price_uuid?: string | null
          service_subscription_transactions_uuid?: string
          service_uuid?: string | null
          user_uuid?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_price_uuid?: string | null
          service_subscription_transactions_uuid?: string
          service_uuid?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_subscriptions_transactions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_transactions_service_price_uuid_fkey"
            columns: ["service_price_uuid"]
            isOneToOne: false
            referencedRelation: "service_prices"
            referencedColumns: ["service_price_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_transactions_service_uuid_fkey"
            columns: ["service_uuid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_transactions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      services: {
        Row: {
          active_subscriptions_count: number | null
          created_at: string
          description: string | null
          expert_uuid: string | null
          features: Json | null
          id: number
          main_category: Json | null
          monthly_recurring_revenue: number | null
          name: string | null
          payment_url: string | null
          price: number | null
          revenue_amount: number | null
          service_uuid: string
          status: Database["public"]["Enums"]["service_status"] | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          subcategory: Json | null
          type: Database["public"]["Enums"]["service_type"] | null
          user_uuid: string | null
        }
        Insert: {
          active_subscriptions_count?: number | null
          created_at?: string
          description?: string | null
          expert_uuid?: string | null
          features?: Json | null
          id?: number
          main_category?: Json | null
          monthly_recurring_revenue?: number | null
          name?: string | null
          payment_url?: string | null
          price?: number | null
          revenue_amount?: number | null
          service_uuid?: string
          status?: Database["public"]["Enums"]["service_status"] | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subcategory?: Json | null
          type?: Database["public"]["Enums"]["service_type"] | null
          user_uuid?: string | null
        }
        Update: {
          active_subscriptions_count?: number | null
          created_at?: string
          description?: string | null
          expert_uuid?: string | null
          features?: Json | null
          id?: number
          main_category?: Json | null
          monthly_recurring_revenue?: number | null
          name?: string | null
          payment_url?: string | null
          price?: number | null
          revenue_amount?: number | null
          service_uuid?: string
          status?: Database["public"]["Enums"]["service_status"] | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subcategory?: Json | null
          type?: Database["public"]["Enums"]["service_type"] | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
          {
            foreignKeyName: "services_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      threads: {
        Row: {
          community_uuid: string | null
          created_at: string
          expert_uuid: string | null
          id: number
          initial_message: string | null
          last_message_at: string | null
          number_messages: number | null
          status: Database["public"]["Enums"]["thread_status"] | null
          tag: Database["public"]["Enums"]["thread_tag"] | null
          thread_uuid: string
          title: string | null
          upvote_count: number | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          community_uuid?: string | null
          created_at?: string
          expert_uuid?: string | null
          id?: number
          initial_message?: string | null
          last_message_at?: string | null
          number_messages?: number | null
          status?: Database["public"]["Enums"]["thread_status"] | null
          tag?: Database["public"]["Enums"]["thread_tag"] | null
          thread_uuid?: string
          title?: string | null
          upvote_count?: number | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          community_uuid?: string | null
          created_at?: string
          expert_uuid?: string | null
          id?: number
          initial_message?: string | null
          last_message_at?: string | null
          number_messages?: number | null
          status?: Database["public"]["Enums"]["thread_status"] | null
          tag?: Database["public"]["Enums"]["thread_tag"] | null
          thread_uuid?: string
          title?: string | null
          upvote_count?: number | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "threads_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
          {
            foreignKeyName: "threads_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      threads_messages: {
        Row: {
          created_at: string
          id: number
          message: string | null
          thread_message_uuid: string
          thread_uuid: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          thread_message_uuid?: string
          thread_uuid?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          thread_message_uuid?: string
          thread_uuid?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_thread_uuid_fkey"
            columns: ["thread_uuid"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_uuid"]
          },
          {
            foreignKeyName: "community_messages_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string | null
          name: string | null
          rating: number | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticket_uuid: string
          type: Database["public"]["Enums"]["ticket_status"] | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_uuid?: string
          type?: Database["public"]["Enums"]["ticket_status"] | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_uuid?: string
          type?: Database["public"]["Enums"]["ticket_status"] | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          buyer_user_uuid: string | null
          created_at: string
          expert_uuid: string | null
          id: number
          seller_user_uuid: string | null
          transaction_uuid: string
        }
        Insert: {
          amount?: number | null
          buyer_user_uuid?: string | null
          created_at?: string
          expert_uuid?: string | null
          id?: number
          seller_user_uuid?: string | null
          transaction_uuid: string
        }
        Update: {
          amount?: number | null
          buyer_user_uuid?: string | null
          created_at?: string
          expert_uuid?: string | null
          id?: number
          seller_user_uuid?: string | null
          transaction_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_user_uuid_fkey"
            columns: ["buyer_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "transactions_expert_uuid_fkey"
            columns: ["expert_uuid"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["expert_uuid"]
          },
          {
            foreignKeyName: "transactions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      users: {
        Row: {
          active_product_count: number | null
          affiliate_fees_amount: number | null
          affiliate_id: string | null
          affiliate_link: string | null
          affiliate_multiplier: number | null
          affiliate_since: string | null
          available_amount: number | null
          average_review: number | null
          communities_joined: Json | null
          created_at: string
          email: string
          fees_amount: number | null
          first_name: string | null
          id: number
          is_admin: boolean | null
          is_affiliate: boolean | null
          is_expert: boolean | null
          job_amount_spent: number | null
          job_sales_amount: number | null
          last_name: string | null
          member_profile_link: string | null
          net_sales_amount: number | null
          payout_amount: number | null
          product_amount_spent: number | null
          product_count: number | null
          product_sales_amount: number | null
          referral_source: string | null
          requested_amount: number | null
          service_sales_amount: number | null
          service_transaction_amount_spent: number | null
          stripe_client_id: string | null
          subscription_amount_spent: number | null
          subscription_sales_amount: number | null
          total_sales_amount: number | null
          total_spent: number | null
          transaction_count: number | null
          user_thumbnail: string | null
          user_uuid: string
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          via: Database["public"]["Enums"]["signup_via"] | null
        }
        Insert: {
          active_product_count?: number | null
          affiliate_fees_amount?: number | null
          affiliate_id?: string | null
          affiliate_link?: string | null
          affiliate_multiplier?: number | null
          affiliate_since?: string | null
          available_amount?: number | null
          average_review?: number | null
          communities_joined?: Json | null
          created_at?: string
          email: string
          fees_amount?: number | null
          first_name?: string | null
          id?: number
          is_admin?: boolean | null
          is_affiliate?: boolean | null
          is_expert?: boolean | null
          job_amount_spent?: number | null
          job_sales_amount?: number | null
          last_name?: string | null
          member_profile_link?: string | null
          net_sales_amount?: number | null
          payout_amount?: number | null
          product_amount_spent?: number | null
          product_count?: number | null
          product_sales_amount?: number | null
          referral_source?: string | null
          requested_amount?: number | null
          service_sales_amount?: number | null
          service_transaction_amount_spent?: number | null
          stripe_client_id?: string | null
          subscription_amount_spent?: number | null
          subscription_sales_amount?: number | null
          total_sales_amount?: number | null
          total_spent?: number | null
          transaction_count?: number | null
          user_thumbnail?: string | null
          user_uuid: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          via?: Database["public"]["Enums"]["signup_via"] | null
        }
        Update: {
          active_product_count?: number | null
          affiliate_fees_amount?: number | null
          affiliate_id?: string | null
          affiliate_link?: string | null
          affiliate_multiplier?: number | null
          affiliate_since?: string | null
          available_amount?: number | null
          average_review?: number | null
          communities_joined?: Json | null
          created_at?: string
          email?: string
          fees_amount?: number | null
          first_name?: string | null
          id?: number
          is_admin?: boolean | null
          is_affiliate?: boolean | null
          is_expert?: boolean | null
          job_amount_spent?: number | null
          job_sales_amount?: number | null
          last_name?: string | null
          member_profile_link?: string | null
          net_sales_amount?: number | null
          payout_amount?: number | null
          product_amount_spent?: number | null
          product_count?: number | null
          product_sales_amount?: number | null
          referral_source?: string | null
          requested_amount?: number | null
          service_sales_amount?: number | null
          service_transaction_amount_spent?: number | null
          stripe_client_id?: string | null
          subscription_amount_spent?: number | null
          subscription_sales_amount?: number | null
          total_sales_amount?: number | null
          total_spent?: number | null
          transaction_count?: number | null
          user_thumbnail?: string | null
          user_uuid?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          via?: Database["public"]["Enums"]["signup_via"] | null
        }
        Relationships: []
      }
      variants: {
        Row: {
          additional_details: string | null
          compare_price: number | null
          created_at: string
          files_link: string | null
          highlighted: boolean | null
          id: number
          name: string | null
          price: number | null
          product_uuid: string | null
          tags: Json | null
          user_uuid: string | null
          variant_uuid: string
        }
        Insert: {
          additional_details?: string | null
          compare_price?: number | null
          created_at?: string
          files_link?: string | null
          highlighted?: boolean | null
          id?: number
          name?: string | null
          price?: number | null
          product_uuid?: string | null
          tags?: Json | null
          user_uuid?: string | null
          variant_uuid?: string
        }
        Update: {
          additional_details?: string | null
          compare_price?: number | null
          created_at?: string
          files_link?: string | null
          highlighted?: boolean | null
          id?: number
          name?: string | null
          price?: number | null
          product_uuid?: string | null
          tags?: Json | null
          user_uuid?: string | null
          variant_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "variants_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "variants_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_related_products_with_variants: {
        Args: { product_uuid_input: string }
        Returns: {
          related_product_uuid: string
          related_product_name: string
          related_product_price_from: number
          variant_uuid: string
          variant_name: string
          variant_price: number
          variant_tags: Json
          variant_files_link: string
        }[]
      }
    }
    Enums: {
      affiliate_status: "new" | "accepted" | "needs attention" | "rejected"
      applications_status:
        | "open"
        | "rejected"
        | "pending"
        | "accepted"
        | "withdrawn"
        | "open conversation"
      classroom_status: "visible" | "not visible"
      commnunity_subscription_type: "free" | "paid"
      community_billing_period: "monthly" | "yearly"
      community_price_status: "active" | "inactive"
      community_product_type: "free" | "paid"
      community_subscription_status: "active" | "inactive"
      community_type: "free" | "paid"
      community_visibility: "draft" | "private" | "public"
      conversation_source: "template" | "job request" | "information request"
      conversation_status: "open" | "closed" | "need attention"
      job_status:
        | "open"
        | "archived"
        | "closed"
        | "paid"
        | "completed"
        | "pending payment"
        | "disputed"
      payment_provider: "stripe"
      payout_status: "requested" | "paid out"
      product_free_or_paid: "free" | "paid"
      product_status: "active" | "draft" | "inactive"
      product_transaction_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "refunded"
        | "chargeback"
      product_transaction_type: "guest" | "user"
      product_type: "template" | "guide or manual"
      review_status: "published" | "not published"
      review_type: "product" | "service" | "job" | "community"
      service_price_status: "active" | "inactive"
      service_status: "draft" | "active" | "archived"
      service_subscription_status: "active" | "inactive"
      service_type: "one time" | "monthly"
      signup_via:
        | "sign-up"
        | "sign-up community"
        | "guest transaction"
        | "sign-up community paid"
      thread_status: "open" | "closed"
      thread_tag: "general" | "support" | "off topic" | "anouncements"
      ticket_status:
        | "open"
        | "archived"
        | "closed"
        | "requires attention"
        | "in progress"
      ticket_type:
        | "others"
        | "problem with a purchase"
        | "join as seller"
        | "product question"
      transaction_item_status:
        | "pending"
        | "processing"
        | "completed"
        | "disputed"
        | "failed"
        | "cancelled"
        | "expired"
        | "refunded"
        | "partially refunded"
        | "chargeback"
        | "access revoked"
        | "failed fulfillment"
      transaction_type:
        | "product"
        | "job"
        | "service"
        | "community"
        | "custom request"
      variant_tags: "premium" | "basic"
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
      affiliate_status: ["new", "accepted", "needs attention", "rejected"],
      applications_status: [
        "open",
        "rejected",
        "pending",
        "accepted",
        "withdrawn",
        "open conversation",
      ],
      classroom_status: ["visible", "not visible"],
      commnunity_subscription_type: ["free", "paid"],
      community_billing_period: ["monthly", "yearly"],
      community_price_status: ["active", "inactive"],
      community_product_type: ["free", "paid"],
      community_subscription_status: ["active", "inactive"],
      community_type: ["free", "paid"],
      community_visibility: ["draft", "private", "public"],
      conversation_source: ["template", "job request", "information request"],
      conversation_status: ["open", "closed", "need attention"],
      job_status: [
        "open",
        "archived",
        "closed",
        "paid",
        "completed",
        "pending payment",
        "disputed",
      ],
      payment_provider: ["stripe"],
      payout_status: ["requested", "paid out"],
      product_free_or_paid: ["free", "paid"],
      product_status: ["active", "draft", "inactive"],
      product_transaction_status: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
        "chargeback",
      ],
      product_transaction_type: ["guest", "user"],
      product_type: ["template", "guide or manual"],
      review_status: ["published", "not published"],
      review_type: ["product", "service", "job", "community"],
      service_price_status: ["active", "inactive"],
      service_status: ["draft", "active", "archived"],
      service_subscription_status: ["active", "inactive"],
      service_type: ["one time", "monthly"],
      signup_via: [
        "sign-up",
        "sign-up community",
        "guest transaction",
        "sign-up community paid",
      ],
      thread_status: ["open", "closed"],
      thread_tag: ["general", "support", "off topic", "anouncements"],
      ticket_status: [
        "open",
        "archived",
        "closed",
        "requires attention",
        "in progress",
      ],
      ticket_type: [
        "others",
        "problem with a purchase",
        "join as seller",
        "product question",
      ],
      transaction_item_status: [
        "pending",
        "processing",
        "completed",
        "disputed",
        "failed",
        "cancelled",
        "expired",
        "refunded",
        "partially refunded",
        "chargeback",
        "access revoked",
        "failed fulfillment",
      ],
      transaction_type: [
        "product",
        "job",
        "service",
        "community",
        "custom request",
      ],
      variant_tags: ["premium", "basic"],
    },
  },
} as const

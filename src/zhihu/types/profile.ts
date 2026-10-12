// TypeScript types for `zhihu user <UrlToken> --json` (zhihu-cli) output.
// Root interface: ZhihuUserProfileResponse

export interface ZhihuUserProfileParams {
  urlToken: string;
}

export interface ZhihuUserProfileResponse {
  id: string;
  url_token: string;
  name: string;
  use_default_avatar: boolean;
  avatar_url: string;
  avatar_url_template: string;
  is_org: boolean;
  type: string;
  url: string;
  user_type: string;
  headline: string;
  headline_render: string;
  description: string;
  gender: number;
  is_advertiser: boolean;
  ip_info: string;
  vip_info: VipInfo;
  kvip_info: KvipInfo;
  badge: Badge[];
  badge_v2: BadgeV2;
  follower_count: number;
  follower_count_text: string;
  follower_count_num: string;
  follower_count_unit: string;
  following_count: number;
  following_count_num: string;
  following_count_unit: string;
  answer_count: number;
  articles_count: number;
  project_count: number;
  favorite_count: number;
  favorited_count: number;
  voteup_count: number;
  thanked_count: number;
  available_medals_count: number;
  business: Topic;
  locations: Topic[];
  employments: Employment[];
  educations: Education[];
  org_verify_status: any | null;
  is_realname: boolean;
  has_applying_column: boolean;
  is_new_rename: boolean;
  has_agent_content: boolean;
  ai_assistant_info: any | null;
  extra: any | null;
}

export interface VipInfo {
  is_vip: boolean;
  vip_type: number;
  rename_days: string;
  entrance_v2: any | null;
  rename_frequency: number;
  rename_await_days: number;
}

export interface KvipInfo {
  is_vip: boolean;
}

export interface Badge {
  type: string;
  description: string;
}

export interface BadgeV2 {
  title: string;
  merged_badges: BadgeDetail[];
  detail_badges: BadgeDetail[];
  icon: string;
  night_icon: string;
}

export interface BadgeDetail {
  type: string;
  detail_type: string;
  title: string;
  description: string;
  url: string;
  sources: BadgeSource[];
  icon: string;
  night_icon: string;
  badge_status: string;
}

export interface BadgeSource {
  id: string;
  token: string;
  type: string;
  url: string;
  name: string;
  avatar_path: string;
  avatar_url: string;
  description: string;
  priority: number;
}

/**
 * 话题实体 (行业 / 居住地 / 公司 / 职位 / 学校 等均为此结构)
 */
export interface Topic {
  id: string;
  type: string;
  url: string;
  name: string;
  avatar_url: string;
}

export interface Employment {
  job?: Topic;
  company?: Topic;
}

export interface Education {
  school?: Topic;
  major?: Topic;
}

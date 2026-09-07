// Auto-generated TypeScript types for the Zhihu answer detail API response.
// Root interface: ZhihuAnswerDetailResponse

export interface ZhihuFetchAnswerDetailParams {
  answerId: string;
  includes?: string[];
  offset?: number;
  limit?: number;
  order?: string;
  ws_qiangzhisafe?: number;
  platform?: string;
}

export interface ZhihuAnswersDetailResponse {
  data: ZhihuAnswerDetailItem[];
  finished_reading_filtered_count: number;
  session: Session;
  paging: Paging;
}

export interface ZhihuAnswerDetail {
  type: string;
  target_type: string;
  target: ZhihuAnswerDetailItem;
  skip_count: boolean;
  position: number;
  cursor: string;
  is_jump_native: boolean;
}

export interface Session {
  id: string;
}

export interface Paging {
  page: number;
  is_end: boolean;
  next: string;
  need_force_login: boolean;
}

export interface ZhihuAnswerDetailItem {
  allow_segment_interaction: number;
  answer_type: string;
  attached_info: string;
  author: Author;
  business_type: string;
  comment_count: number;
  content: string;
  content_mark: Record<string, any>;
  content_need_truncated: boolean;
  created_time: number;
  decorative_labels: any[];
  editable_content: string;
  endorsements: Endorsement[];
  excerpt: string;
  extras: string;
  favlists_count: number;
  force_login_when_click_read_more: boolean;
  has_publishing_draft: boolean;
  hot_comment: HotComment[];
  id: string;
  is_collapsed: boolean;
  is_copyable: boolean;
  is_jump_native: boolean;
  is_mine: boolean;
  is_navigator: boolean;
  is_sticky: boolean;
  is_visible: boolean;
  matrix_tips: string;
  navigator_vote: boolean;
  question: Question;
  reaction: Reaction;
  reaction_instruction: Record<string, any>;
  relationship: Relationship;
  relevant_info: RelevantInfo;
  segment_infos: SegmentInfo[];
  sticky_info: string;
  thanks_count: number;
  thumbnail_info: ThumbnailInfo;
  type: string;
  updated_time: number;
  url: string;
  visible_only_to_author: boolean;
  vote_next_step: string;
  voteup_count: number;
}

export interface Author {
  avatar_url: string;
  avatar_url_template: string;
  badge: Badge[];
  badge_v2: BadgeV2;
  exposed_medal: ExposedMedal;
  gender: number;
  headline: string;
  id: string;
  is_advertiser: boolean;
  is_followed: boolean;
  is_following: boolean;
  is_org: boolean;
  is_privacy: boolean;
  name: string;
  type: string;
  url: string;
  url_token: string;
  user_type: string;
}

export interface Endorsement {
  action_url: string;
  background_color: BackgroundColor;
  elements: Element[];
  sub_elements: any[];
  sub_elements_type: string;
  za: Za;
}

export interface HotComment {
  author: Author2;
  can_collapse: boolean;
  can_delete: boolean;
  can_dislike: boolean;
  can_hot: boolean;
  can_like: boolean;
  can_more: boolean;
  can_reply: boolean;
  can_share: boolean;
  can_truncate: boolean;
  can_unfold: boolean;
  child_comment_count: number;
  collapsed: boolean;
  comment_tag: CommentTag[];
  content: string;
  created_time: number;
  dislike_count: number;
  disliked: boolean;
  hot: boolean;
  id: string;
  is_author: boolean;
  is_delete: boolean;
  like_count: number;
  liked: boolean;
  object_id: number;
  object_type: number;
  reply_comment_id: string;
  resource_type: string;
  reviewing: boolean;
  score: number;
  top: boolean;
  type: string;
  url: string;
}

export interface Question {
  created: number;
  id: string;
  question_type: string;
  relationship: any | null;
  title: string;
  type: string;
  updated_time: number;
  url: string;
}

export interface Reaction {
  relation: Relation;
  statistics: Statistics;
}

export interface Relationship {
  is_favorited: boolean;
  upvoted_followees: any[];
  voting: number;
}

export interface RelevantInfo {
  is_relevant: boolean;
  relevant_text: string;
  relevant_type: string;
}

export interface SegmentInfo {
  marks: Mark[];
  pid: string;
  text: string;
}

export interface ThumbnailInfo {
  count: number;
  thumbnails: Thumbnail[];
  type: string;
}

export interface Badge {
  description: string;
  topics: any[];
  type: string;
}

export interface BadgeV2 {
  detail_badges: DetailBadge[];
  icon: string;
  merged_badges: MergedBadge[];
  night_icon: string;
  title: string;
}

export interface ExposedMedal {
  avatar_url: string;
  description: string;
  medal_avatar_frame: string;
  medal_id: string;
  medal_name: string;
  mini_avatar_url: string;
}

export interface BackgroundColor {
  alpha: number;
  group: string;
}

export interface Element {
  height?: number;
  image_color?: ImageColor;
  image_key?: string;
  type: string;
  width?: number;
  content?: string;
  font_color?: FontColor;
  font_size?: number;
  is_bold?: boolean;
  max_line?: number;
}

export interface Za {
  block_text: string;
  text: string;
  type: string;
}

export interface Author2 {
  avatar_url: string;
  avatar_url_template: string;
  badge_v2: BadgeV22;
  exposed_medal: ExposedMedal2;
  gender: number;
  headline: string;
  id: string;
  is_advertiser: boolean;
  is_org: boolean;
  kvip_info: KvipInfo;
  name: string;
  type: string;
  url: string;
  url_token: string;
  user_type: string;
  vip_info: VipInfo;
}

export interface CommentTag {
  color: string;
  has_border: boolean;
  night_color: string;
  text: string;
  type: string;
}

export interface Relation {
  faved: boolean;
  liked: boolean;
}

export interface Statistics {
  applaud_count: number;
  bullet_count: number;
  comment_count: number;
  down_vote_count: number;
  favorites: number;
  img_like_count: Record<string, number>;
  interest_play_count: number;
  like_count: number;
  plaincontent_like_count: number;
  plaincontent_vote_up_count: number;
  play_count: number;
  pv_count: number;
  question_answer_count: number;
  question_follower_count: number;
  republishers: any[];
  share_count: number;
  subscribe_count: number;
  up_vote_count: number;
}

export interface Mark {
  end_index: number;
  seg_info: SegInfo;
  start_index: number;
}

export interface Thumbnail {
  height: number;
  token: string;
  type: string;
  url: string;
  width: number;
}

export interface DetailBadge {
  description: string;
  detail_type: string;
  icon: string;
  night_icon: string;
  sources: Source[];
  title: string;
  type: string;
  url: string;
}

export interface MergedBadge {
  description: string;
  detail_type: string;
  icon: string;
  night_icon: string;
  sources: any[];
  title: string;
  type: string;
  url: string;
}

export interface ImageColor {
  alpha: number;
  group: string;
}

export interface FontColor {
  alpha: number;
  group: string;
}

export interface BadgeV22 {
  detail_badges: any[];
  merged_badges: any[];
  title: string;
}

export interface ExposedMedal2 {
  avatar_url: string;
  can_click: boolean;
  description: string;
  medal_avatar_frame: string;
  medal_id: string;
  medal_name: string;
  mini_avatar_url: string;
}

export interface KvipInfo {
  is_vip: boolean;
}

export interface VipInfo {
  is_vip: boolean;
  vip_icon: VipIcon;
}

export interface SegInfo {
  comment_count: number;
  is_like: boolean;
  is_span: boolean;
  like_count: number;
  my_comment_count: number;
  seg_ids: string[];
}

export interface Source {
  avatar_path: string;
  avatar_url: string;
  description: string;
  id: string;
  name: string;
  priority: number;
  token: string;
  type: string;
  url: string;
}

export interface VipIcon {
  night_mode_url: string;
  url: string;
}

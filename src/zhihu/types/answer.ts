// TypeScript types for `zhihu answer <AnswerID> --json` (zhihu-cli) output.
// Root interface: ZhihuAnswerDetailItem

import { Badge, BadgeV2 } from './profile';

export interface ZhihuFetchAnswerDetailParams {
  answerId: string;
}

export interface ZhihuAnswerDetailItem {
  allow_segment_interaction: number;
  answer_type: string;
  author: Author;
  biz_ext?: BizExt;
  comment_count: number;
  content: string;
  content_need_truncated: boolean;
  created_time: number;
  extras: string;
  force_login_when_click_read_more: boolean;
  id: string;
  is_collapsed: boolean;
  is_copyable: boolean;
  is_jump_native: boolean;
  podcast_audio_enter?: PodcastAudioEnter;
  question: Question;
  relationship: Relationship;
  segment_infos: SegmentInfo[];
  type: string;
  updated_time: number;
  url: string;
  voteup_count: number;
}

export interface Author {
  avatar_url: string;
  avatar_url_template: string;
  badge: Badge[];
  badge_v2: BadgeV2;
  gender: number;
  headline: string;
  id: string;
  is_advertiser: boolean;
  is_org: boolean;
  is_privacy: boolean;
  name: string;
  type: string;
  url: string;
  url_token: string;
  user_type: string;
}

export interface BizExt {
  share_guide: ShareGuide;
}

export interface ShareGuide {
  has_positive_bubble: boolean;
  has_time_bubble: boolean;
  hit_share_guide_cluster: boolean;
}

export interface PodcastAudioEnter {
  action_url: string;
  sub_type: string;
  text: string;
  text_color: string;
  text_size: number;
}

export interface Question {
  created: number;
  id: string;
  question_type: string;
  relationship: Record<string, any>;
  title: string;
  type: string;
  updated_time: number;
  url: string;
}

export interface Relationship {
  upvoted_followees: any[];
}

export interface SegmentInfo {
  marks: Mark[];
  pid: string;
  text: string;
}

export interface Mark {
  end_index: number;
  seg_info: SegInfo;
  start_index: number;
}

export interface SegInfo {
  comment_count: number;
  is_like: boolean;
  is_span: boolean;
  like_count: number;
  my_comment_count: number;
  seg_ids: string[];
}

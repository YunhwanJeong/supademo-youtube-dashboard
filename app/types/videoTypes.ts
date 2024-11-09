export interface ThumbnailType {
  url: string;
  width: number;
  height: number;
}

export interface ThumbnailsType {
  default: ThumbnailType;
  medium: ThumbnailType;
  high: ThumbnailType;
}

export interface VideoIdType {
  kind: string;
  videoId: string;
}

export interface SnippetType {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: ThumbnailsType;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

export interface VideoItemType {
  kind: string;
  etag: string;
  id: VideoIdType;
  snippet: SnippetType;
}

export interface PageInfoType {
  totalResults: number;
  resultsPerPage: number;
}

export interface VideoResponseType {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfoType;
  items: VideoItemType[];
}

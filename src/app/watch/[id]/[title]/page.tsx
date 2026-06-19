import type { Metadata, ResolvingMetadata } from "next";

import { VideoPlayerProvider } from "@/providers/videoPlayer";

import VideoPlayer from "./_components/videoPlayer";
import MediaDetails from "./_components/currentMedia";
import Videos from "./_components/videos";

import { getAnimeInfo, getEpisodeStreamingLinks } from "@/lib/anime-service";

import "./page.css";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string; title: string }> };

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title } = await params;
  return {
    title: `${decodeURIComponent(title)} - Watch on Funyroll`,
  };
}

export default async function Watch({ params }: Readonly<PageProps>) {
  const { id } = await params;

  const animeId = id.split("-episode-")[0];
  const episodeNumber = id.includes("-episode-") ? parseInt(id.split("-episode-")[1]) : 1;

  const info = await getAnimeInfo(animeId);
  const episodes = info.episodes || [];
  const episode = episodes.find((e: any) => e.number === episodeNumber) || episodes[0];

  if (!episode) {
    return <div>Episode not found</div>;
  }

  const streamData = await getEpisodeStreamingLinks(episode.id);
  const hlsSource = streamData.sources.find((s: any) => s.isM3U8) || streamData.sources[0];

  const prevEpisodeData = episodes.find((e: any) => e.number === episodeNumber - 1);
  const nextEpisodeData = episodes.find((e: any) => e.number === episodeNumber + 1);

  const mapToMini = (ep: any) => ep ? ({
    id: ep.id,
    title: ep.title || `Episode ${ep.number}`,
    thumbnail: info.image,
    duration: 0,
    season: 1,
    episode: ep.number,
    metaTags: [info.type].filter(Boolean),
  }) : null;

  return (
    <>
      <main>
        <VideoPlayerProvider media={hlsSource.url}>
          <VideoPlayer duration={0} />
        </VideoPlayerProvider>

        <div className="content-wrapper">
          <div className="content-wrapper-body 2sm:pt-8 grid grid-cols-[minmax(min-content,54.375rem)_auto] justify-center pt-6">
            <MediaDetails
              seriesId={info.id}
              seriesTitle={info.title}
              averageRating={0}
              totalRating={0}
              title={episode.title || `Episode ${episode.number}`}
              metaTags={[info.type, info.releaseDate].filter(Boolean)}
              releaseDate={info.releaseDate || ""}
              likes={0}
              dislikes={0}
              description={info.description}
              details={{
                Status: info.status,
                Total: info.totalEpisodes,
              }}
            />

            <Videos
              prevEpisode={mapToMini(prevEpisodeData)}
              nextEpisode={mapToMini(nextEpisodeData)}
            />
          </div>
        </div>
      </main>

      <footer></footer>
    </>
  );
}

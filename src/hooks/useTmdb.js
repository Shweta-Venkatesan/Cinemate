import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import * as tmdb from '../services/tmdbService'

export const useGenres = () =>
  useQuery({ queryKey: ['genres'], queryFn: tmdb.getGenres, staleTime: Infinity })

export const useTrending = (window = 'week') =>
  useQuery({ queryKey: ['trending', window], queryFn: () => tmdb.getTrending(window), staleTime: 3600000 })

export const usePopular = (page = 1) =>
  useQuery({ queryKey: ['popular', page], queryFn: () => tmdb.getPopular(page), staleTime: 21600000 })

export const useTopRated = (page = 1) =>
  useQuery({ queryKey: ['topRated', page], queryFn: () => tmdb.getTopRated(page), staleTime: 21600000 })

export const useByGenre = (genreId, page = 1) =>
  useQuery({
    queryKey: ['byGenre', genreId, page],
    queryFn: () => tmdb.getByGenre(genreId, page),
    staleTime: 21600000,
    enabled: !!genreId,
  })

export const useMovieDetails = (id) =>
  useQuery({
    queryKey: ['movieAll', id],
    queryFn: () => tmdb.getMovieDetailsAll(id),
    staleTime: 86400000,
    enabled: !!id,
  })

export const useSimilar = (id) =>
  useQuery({
    queryKey: ['similar', id],
    queryFn: () => tmdb.getSimilar(id),
    staleTime: 86400000,
    enabled: !!id,
  })

export const useNowPlaying = () =>
  useQuery({ queryKey: ['nowPlaying'], queryFn: tmdb.getNowPlaying, staleTime: 3600000 })

export const useInfiniteSearch = (query) =>
  useInfiniteQuery({
    queryKey: ['infiniteSearch', query],
    queryFn: ({ pageParam = 1 }) => tmdb.searchByTitle(query, pageParam),
    getNextPageParam: (last) => last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 300000,
    enabled: !!query?.trim(),
  })

export const useUnifiedSearch = (query) =>
  useQuery({
    queryKey: ['unifiedSearch', query],
    queryFn: () => tmdb.unifiedSearch(query),
    staleTime: 300000,
    enabled: !!query?.trim() && query.length > 1,
  })

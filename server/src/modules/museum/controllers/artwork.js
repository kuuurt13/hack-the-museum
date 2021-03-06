import express from 'express'
import cache from '../services/cache'
import artworkService from '../services/artwork'
import artworkFormatter from '../services/formatter'

const router = express.Router()

router.get('/artwork/:id', artworkDetail)
router.post('/artwork/:id/song', addSongToArtwork)
router.post('/artwork/:id/song/:action', artworkSongAction)
router.post('/artwork/recommendations/genres', getArtworkForGenres)

async function artworkDetail(req, res) {
  const { id } = req.params

  try {
    const artwork = await cache.getJson(id)
    const music = await artworkService.getSavedById(id)

    if (!artwork) {
      return res.status(404).send()
    }

    const data = artworkFormatter.detail({
      ...artwork,
      music
    })

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json(error)
  }
}

async function addSongToArtwork(req, res) {
  const song = req.body
  const { id } = req.params

  if (!song) {
    return res.status(400).send()
  }

  try {
    const data = await artworkService.addSong(id, song)

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json(error)
  }
}

async function artworkSongAction(req, res) {
  const song = req.body
  const { id, action } = req.params
  const artworkAction = artworkService.songActions[action]

  if (!song || !artworkAction) {
    return res.status(!song ? 400 : 404).send()
  }

  try {
    const data = await artworkAction(id, song)

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json(error)
  }
}

async function getArtworkForGenres(req, res) {
  const { genres } = req.body

  if (!genres || !genres.length) {
    return res.status(400).send()
  }

  try {
    const artwork = await artworkService.getArtworkForGenres(genres)

    return res.status(200).json(artwork)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export default router

//express module
const express = require('express')
const app = express()
app.listen(3000)

//youtuber objects
//https://www.youtube.com/@shortbox
let youtuber1 = {
    channelTitle: "숏박스",
    sub: "3.13M",
    videoNum: "168개"
}

//https://www.youtube.com/@ChimChakMan_Official
let youtuber2 = {
    channelTitle: "침착맨",
    sub: "2.66M",
    videoNum: "7.3천개"
}

//https://www.youtube.com/@tzuyang6145
let youtuber3 = {
    channelTitle: "tzuyang",
    sub: "11.1M",
    videoNum: "783개"
}

let db = new Map()
let id = 1
db.set(id++, youtuber1)
db.set(id++, youtuber2)
db.set(id++, youtuber3)

//REST API

//유튜버 전체 조회
app.get('/youtubers', (req, res) => {
    let youtubers = {}
    if(db.size > 0){
        db.forEach(function (value, key) {
            youtubers[key] = value
        })
    
        res.json(youtubers)
    }else{
        res.status(404).json({
            message : "조회할 유튜버가 없습니다."
        })
    }
})

//유튜버 개별 조회
app.get('/youtubers/:id', function (req, res) {
    let { id } = req.params
    id = parseInt(id)

    if (db.get(id) == undefined) {
        res.json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        res.json(db.get(id))
    }
})

//POST 새로운 유튜버 추가
app.use(express.json())
app.post('/youtubers', (req, res) => {
    if(req.body.channelTitle){
        db.set(id++, req.body) //db에 새 유튜버 정보 추가
        res.status(201).json({
            message: `${db.get(id - 1).channelTitle}님, 유튜브에 오신 것을 축하드립니다!`
        })
    }else{
        res.status(400).json({
            message : "채널명을 입력해주세요."
        })
    }
})

//DELETE 유튜버 개별 삭제
app.delete('/youtubers/:id', function (req, res) {
    let { id } = req.params
    id = parseInt(id)

    let youtuber = db.get(id)
    if (youtuber == undefined) {
        res.status(404).json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        res.json({
            message: `${youtuber.channelTitle}님, 아쉽지만 다음에 또 뵙겠습니다.`
        })
        db.delete(id)
    }
})

//유튜버 전체 삭제
app.delete('/youtubers', (req, res) => {

    let msg = ""
    let status = 200
    if (db.size > 0) {
        db.clear()
        msg = "전체 유튜버가 삭제되었습니다."
    } else {
        msg = "삭제할 유튜버가 없습니다."
        status = 404
    }
    res.status(status).json({
        message: msg
    })
})

//유튜버 채널명 수정
app.put('/youtubers/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)

    let youtuber = db.get(id)
    if (youtuber == undefined) {
        res.status(404).json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        let newTitle = req.body.channelTitle
        let oldTitle = youtuber.channelTitle

        youtuber.channelTitle = newTitle
        db.set(id, youtuber)

        res.json({
            message: `${oldTitle}님, 채널명이 ${newTitle}로 변경되었습니다.`
        })
    }
})
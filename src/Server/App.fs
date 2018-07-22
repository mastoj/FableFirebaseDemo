namespace Server

open Fable.Core

module App =
    open Fable.Import.Firebase.Functions
    open Fable.Import.express

    let private handler req (res: Response) = res.send("Hello") |> ignore

    let helloworld = https.onRequest handler
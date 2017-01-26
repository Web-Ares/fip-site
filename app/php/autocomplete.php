<?php

$val = $_GET['value'];
$loadedCount = $_GET['loadedCount'];

if ($loadedCount == 1){

    $json_data = '[
    {
        "caption": "Bruxelles"
    }
    ]';

}

if ($loadedCount == 2){

    $json_data = '[
    {
        "caption": "Bruxelles"
    },
    {
        "caption" : "Jette"
    }
    ]';

}

if ($loadedCount == 3){

    $json_data = '[
    {
        "caption": "Bruxelles"
    },
    {
        "caption" : "Jette"
    },
    {
        "caption" : "Anderlecht"
    }
    ]';
}

if ($loadedCount > 3){
    $json_data = '[
    {
        "caption": "Bruxelles"
    },
    {
        "caption" : "Jette"
    },
    {
        "caption" : "Anderlecht"
    },
    {
        "caption" : "Bruxelles-Ville"
    },
    {
        "caption" : "Saint-Gilles"
    },
    {
        "caption" : "Waterloo"
    },
    {
        "caption" : "Woluwe-Saint-Pierre"
    },
    {
        "caption" : "Ganshoren"
    },
    {
        "caption" : "Forest"
    },
    {
        "caption" : "Evere"
    },
    {
        "caption" : "Auderghem"
    }
    ]';
}

$json_data = str_replace("\r\n",'',$json_data);
$json_data = str_replace("\n",'',$json_data);
echo $json_data;
exit;
?>
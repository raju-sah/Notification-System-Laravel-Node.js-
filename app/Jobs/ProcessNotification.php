<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class ProcessNotification implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $notificationData;

    public function __construct($notificationData = [])
    {
        $this->notificationData = $notificationData;
    }

    public function handle(): void
    {
        $notification = Notification::create($this->notificationData);

        // Publish to Redis Pub/Sub
        Redis::publish('notifications', json_encode($notification));
    }
}
